/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { getAuth, getFirestore } from "../../firebaseConfig/firebaseCore";
import UniversityData from "../../data/Universities";
import { testFirebaseStorage } from "../../utils/firebaseTestUtils";
import Card from "../alert/Card";
import "./ReportItemForm.css";

const ReportItemForm = ({ onClose, onSubmit }) => {
  const [user, setUser] = useState(null);
  const [authInstance, setAuthInstance] = useState(null);

  // Initialize auth lazily
  useEffect(() => {
    const initAuth = async () => {
      try {
        const authInst = await getAuth();
        const { useAuthState } = await import("react-firebase-hooks/auth");
        setAuthInstance(authInst);

        // Set up auth state listener
        const { onAuthStateChanged } = await import("firebase/auth");
        const unsubscribe = onAuthStateChanged(authInst, (currentUser) => {
          setUser(currentUser);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Auth initialization error:", error);
      }
    };

    initAuth();
  }, []);
  const [formData, setFormData] = useState({
    role: "",
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    email: user?.email || "",
    phone: "",
    contactPreference: "email", // email, phone, both
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageInfo, setImageInfo] = useState(null); // Track image size info

  // Alert state management
  const [alert, setAlert] = useState({
    isVisible: false,
    type: "success", // 'success' or 'error'
    message: "",
  });

  // Show alert for 3 seconds
  const showAlert = useCallback((type, message) => {
    setAlert({
      isVisible: true,
      type,
      message,
    });

    setTimeout(() => {
      setAlert((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  }, []);

  // Close alert manually
  const closeAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, isVisible: false }));
  }, []);

  // Security validation functions
  const securityValidation = useMemo(
    () => ({
      // Sanitize user input to prevent XSS attacks (for real-time input)
      sanitizeInput: (input) => {
        if (typeof input !== "string") return input;
        return input
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
          .replace(/<[^>]*>?/gm, "") // Remove HTML tags
          .replace(/javascript:/gi, "") // Remove javascript: protocol
          .replace(/on\w+\s*=/gi, "") // Remove event handlers
          .substring(0, 1000); // Limit length (DON'T trim here - preserves spaces for user input)
      },

      // Sanitize and trim for final submission
      sanitizeForSubmission: (input) => {
        if (typeof input !== "string") return input;
        return input
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
          .replace(/<[^>]*>?/gm, "") // Remove HTML tags
          .replace(/javascript:/gi, "") // Remove javascript: protocol
          .replace(/on\w+\s*=/gi, "") // Remove event handlers
          .trim() // Only trim during submission
          .substring(0, 1000); // Limit length
      },

      // Validate email format and domain
      validateEmail: (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return false;

        // Check for suspicious patterns
        const suspiciousPatterns = [
          /\+.*\+/, // Multiple + signs
          /\.{2,}/, // Multiple dots
          /@.*@/, // Multiple @ signs
        ];

        return !suspiciousPatterns.some((pattern) => pattern.test(email));
      },

      // Validate phone number format
      validatePhoneNumber: (phone) => {
        const cleanPhone = phone.replace(/\s+/g, "");
        const phoneRegex = /^(\+92|0)?[0-9]{10}$/;

        // Check for suspicious patterns
        if (cleanPhone.length > 15) return false; // Too long
        if (!/^\+?[0-9\s-()]+$/.test(phone)) return false; // Invalid characters

        return phoneRegex.test(cleanPhone);
      },

      // Rate limiting check (basic client-side)
      checkRateLimit: () => {
        const lastSubmit = localStorage.getItem("lastFormSubmit");
        const now = Date.now();

        if (lastSubmit && now - parseInt(lastSubmit) < 30000) {
          // 30 seconds cooldown
          return false;
        }

        localStorage.setItem("lastFormSubmit", now.toString());
        return true;
      },

      // Validate image file
      validateImageFile: (file) => {
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
          throw new Error(
            "Invalid file type. Only JPEG, PNG, and WebP are allowed."
          );
        }

        if (file.size > maxSize) {
          throw new Error("File size too large. Maximum 10MB allowed.");
        }

        return true;
      },

      // Validate form data structure
      validateFormData: (data) => {
        const requiredFields = [
          "role",
          "title",
          "description",
          "category",
          "date",
        ];

        // Check required fields
        for (const field of requiredFields) {
          if (
            !data[field] ||
            typeof data[field] !== "string" ||
            data[field].trim().length === 0
          ) {
            throw new Error(`${field} is required and cannot be empty.`);
          }
        }

        // Validate field lengths
        if (data.title.length > 100)
          throw new Error("Title is too long (max 100 characters).");
        if (data.description.length > 1000)
          throw new Error("Description is too long (max 1000 characters).");
        if (data.location && data.location.length > 200)
          throw new Error("Location is too long (max 200 characters).");

        // Validate date
        const itemDate = new Date(data.date);
        const now = new Date();
        const oneYearAgo = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );

        if (itemDate > now) throw new Error("Date cannot be in the future.");
        if (itemDate < oneYearAgo)
          throw new Error("Date cannot be more than 1 year ago.");

        return true;
      },
    }),
    []
  );
  const getUserUniversityInfo = useCallback((userEmail) => {
    if (!userEmail) return null;

    const emailDomain = userEmail.split("@")[1];
    if (!emailDomain) return null;

    // Find university by domain
    const universities = UniversityData.getUniversitiesArray();
    const university = universities.find((uni) => uni.domain === emailDomain);

    if (university) {
      return {
        universityId: university.id,
        universityName: university.name,
        universityDomain: university.domain,
        docId: university.docId,
      };
    }

    return {
      universityId: null,
      universityName: "Unknown University",
      universityDomain: emailDomain,
      docId: null,
    };
  }, []);

  // Memoized categories to prevent re-renders
  const categories = useMemo(
    () => [
      "ID Card",
      "Wallet",
      "Notebook",
      "Electronics",
      "Keys",
      "Bag/Backpack",
      "Clothing",
      "Books",
      "Jewelry",
      "Other",
    ],
    []
  );

  // Optimized input handler with security validation
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Apply security sanitization to input
      const sanitizedValue = securityValidation.sanitizeInput(value);

      setFormData((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    },
    [securityValidation]
  );

  // Optimized image handler with security validation
  const handleImageChange = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          // Security validation for image file
          securityValidation.validateImageFile(file);

          // Show immediate preview and pre-compress for faster upload later
          setImagePreview(URL.createObjectURL(file));

          // Store original file size
          const originalSize = file.size;

          // Pre-compress the image in background for faster upload
          try {
            const compressedFile = await compressImage(file);
            const compressedSize = compressedFile.size;
            const compressionRatio = (
              ((originalSize - compressedSize) / originalSize) *
              100
            ).toFixed(1);

            setImageInfo({
              originalSize: (originalSize / 1024 / 1024).toFixed(2),
              compressedSize: (compressedSize / 1024 / 1024).toFixed(2),
              compressionRatio: compressionRatio,
            });

            setFormData((prev) => ({ ...prev, image: compressedFile }));
          } catch (compressionError) {
            // Fallback to original file if compression fails
            setFormData((prev) => ({ ...prev, image: file }));
            setImageInfo({
              originalSize: (originalSize / 1024 / 1024).toFixed(2),
              compressedSize: (originalSize / 1024 / 1024).toFixed(2),
              compressionRatio: 0,
            });
          }
        } catch (validationError) {
          showAlert("error", validationError.message);
          return;
        }
      }
    },
    [showAlert, securityValidation]
  );

  // Phone number validation
  const validatePhone = (phone) => {
    const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
  };

  // Camera capture handler
  const handleCameraCapture = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      // Create video element to show camera feed
      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;

      // Create modal for camera interface
      const cameraModal = document.createElement("div");
      cameraModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `;

      const cameraContainer = document.createElement("div");
      cameraContainer.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 70%;
        background: black;
        border-radius: 10px;
        overflow: hidden;
      `;

      video.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
      `;

      const buttonContainer = document.createElement("div");
      buttonContainer.style.cssText = `
        display: flex;
        gap: 20px;
        margin-top: 20px;
        justify-content: center;
      `;

      const captureBtn = document.createElement("button");
      captureBtn.innerHTML = "📸 Capture";
      captureBtn.style.cssText = `
        background: #4382E4;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
      `;

      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = "❌ Close";
      closeBtn.style.cssText = `
        background: #dc3545;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
      `;

      const switchBtn = document.createElement("button");
      switchBtn.innerHTML = "🔄 Switch Camera";
      switchBtn.style.cssText = `
        background: #6c757d;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
      `;

      let currentFacingMode = "environment";

      // Switch camera function
      const switchCamera = async () => {
        try {
          // Stop current stream
          stream.getTracks().forEach((track) => track.stop());

          // Switch facing mode
          currentFacingMode =
            currentFacingMode === "environment" ? "user" : "environment";

          // Get new stream
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: currentFacingMode,
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          });

          video.srcObject = newStream;
        } catch (error) {
          console.error("Error switching camera:", error);
          showAlert("error", "Could not switch camera");
        }
      };

      // Capture photo function
      const capturePhoto = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to blob
        canvas.toBlob(
          async (blob) => {
            try {
              // Create file from blob
              const file = new File(
                [blob],
                `camera_capture_${Date.now()}.jpg`,
                {
                  type: "image/jpeg",
                }
              );

              // Process the captured image same as file upload
              securityValidation.validateImageFile(file);
              setImagePreview(URL.createObjectURL(file));

              // Compress and set the image
              try {
                const compressedFile = await compressImage(file);
                const compressedSize = compressedFile.size;
                const originalSize = file.size;
                const compressionRatio = (
                  ((originalSize - compressedSize) / originalSize) *
                  100
                ).toFixed(1);

                setImageInfo({
                  originalSize: (originalSize / 1024 / 1024).toFixed(2),
                  compressedSize: (compressedSize / 1024 / 1024).toFixed(2),
                  compressionRatio: compressionRatio,
                });

                setFormData((prev) => ({ ...prev, image: compressedFile }));
              } catch (compressionError) {
                setFormData((prev) => ({ ...prev, image: file }));
                setImageInfo({
                  originalSize: (file.size / 1024 / 1024).toFixed(2),
                  compressedSize: (file.size / 1024 / 1024).toFixed(2),
                  compressionRatio: 0,
                });
              }

              showAlert("success", "Photo captured successfully!");

              // Close camera modal
              closeCameraModal();
            } catch (error) {
              showAlert("error", "Failed to capture photo: " + error.message);
            }
          },
          "image/jpeg",
          0.8
        );
      };

      // Close camera modal function
      const closeCameraModal = () => {
        // Stop camera stream
        const currentStream = video.srcObject;
        if (currentStream) {
          currentStream.getTracks().forEach((track) => track.stop());
        }

        // Remove modal
        document.body.removeChild(cameraModal);
      };

      // Event listeners
      captureBtn.addEventListener("click", capturePhoto);
      closeBtn.addEventListener("click", closeCameraModal);
      switchBtn.addEventListener("click", switchCamera);

      // Assemble modal
      cameraContainer.appendChild(video);
      buttonContainer.appendChild(switchBtn);
      buttonContainer.appendChild(captureBtn);
      buttonContainer.appendChild(closeBtn);
      cameraModal.appendChild(cameraContainer);
      cameraModal.appendChild(buttonContainer);

      // Add to page
      document.body.appendChild(cameraModal);

      // Wait for video to load
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    } catch (error) {
      console.error("Camera access error:", error);

      let errorMessage =
        "Camera access denied. Please use file upload instead.";

      if (error.name === "NotAllowedError") {
        errorMessage =
          "Camera permission denied. Please allow camera access and try again.";
      } else if (error.name === "NotFoundError") {
        errorMessage =
          "No camera found on this device. Please use file upload.";
      } else if (error.name === "NotSupportedError") {
        errorMessage =
          "Camera not supported on this device. Please use file upload.";
      }

      showAlert("error", errorMessage);
    }
  };

  // Optimized image compression with better performance
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // More aggressive compression for faster upload
        const maxWidth = 600; // Reduced from 800
        const maxHeight = 450; // Reduced from 600
        let { width, height } = img;

        // Calculate aspect ratio and resize
        const aspectRatio = width / height;

        if (width > maxWidth || height > maxHeight) {
          if (aspectRatio > 1) {
            // Landscape
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            // Portrait
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Use better compression settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "medium";
        ctx.drawImage(img, 0, 0, width, height);

        // More aggressive compression (0.6 instead of 0.8)
        canvas.toBlob(resolve, "image/jpeg", 0.6);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Convert image to Base64 for Firestore storage (fallback for CORS issues)
  const convertToBase64 = useCallback(async (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        const sizeInKB = Math.round((base64String.length * 0.75) / 1024); // Approximate size

        resolve({
          base64: base64String,
          size: sizeInKB,
          type: "base64",
        });
      };

      reader.onerror = () => {
        reject(new Error("Failed to convert image to Base64"));
      };

      reader.readAsDataURL(imageFile);
    });
  }, []);

  // Database-only image upload using Base64 (no Firebase Storage costs)
  const uploadImage = useCallback(
    async (imageFile) => {
      if (!imageFile) return null;

      try {
        // Reset and start progress
        setUploadProgress(0);
        await new Promise((resolve) => setTimeout(resolve, 100));
        setUploadProgress(20);

        // Convert to Base64 for database storage
        const base64Result = await convertToBase64(imageFile);
        setUploadProgress(60);

        // Check if image is reasonable size for database storage
        if (base64Result.size > 2000) {
          // 2MB limit for database storage
          throw new Error(
            `Image too large for database storage (${base64Result.size}KB). Please use an image smaller than 2MB.`
          );
        }

        setUploadProgress(90);

        // Add timestamp and user info
        const imageData = {
          ...base64Result,
          uploadedAt: new Date().toISOString(),
          uploadedBy: user.uid,
          fileName: `${user.uid}_${Date.now()}.jpg`,
        };

        setUploadProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setUploadProgress(0);

        return imageData;
      } catch (error) {
        setUploadProgress(0);

        if (error.message.includes("too large")) {
          throw error; // Pass through size errors
        } else {
          throw new Error(`Image processing failed: ${error.message}`);
        }
      }
    },
    [user, convertToBase64]
  );

  // Optimized form submission with security
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!user) {
        showAlert("error", "Please sign in to report an item");
        return;
      }

      // Rate limiting check
      if (!securityValidation.checkRateLimit()) {
        showAlert("error", "Please wait 30 seconds before submitting again");
        return;
      }

      try {
        // Security validation and sanitization
        const sanitizedFormData = {
          role: securityValidation.sanitizeForSubmission(formData.role),
          title: securityValidation.sanitizeForSubmission(formData.title),
          description: securityValidation.sanitizeForSubmission(
            formData.description
          ),
          category: securityValidation.sanitizeForSubmission(formData.category),
          location: securityValidation.sanitizeForSubmission(formData.location),
          date: formData.date,
          email: securityValidation.sanitizeForSubmission(formData.email),
          phone: securityValidation.sanitizeForSubmission(formData.phone),
          contactPreference: formData.contactPreference,
        };

        // Validate form data structure
        securityValidation.validateFormData(sanitizedFormData);

        // Contact validation with security checks
        if (
          sanitizedFormData.contactPreference === "email" ||
          sanitizedFormData.contactPreference === "both"
        ) {
          if (!sanitizedFormData.email) {
            showAlert("error", "Please provide an email address");
            return;
          }
          if (!securityValidation.validateEmail(sanitizedFormData.email)) {
            showAlert("error", "Please provide a valid email address");
            return;
          }
        }

        if (
          sanitizedFormData.contactPreference === "phone" ||
          sanitizedFormData.contactPreference === "both"
        ) {
          if (
            !sanitizedFormData.phone ||
            !securityValidation.validatePhoneNumber(sanitizedFormData.phone)
          ) {
            showAlert("error", "Please provide a valid Pakistani phone number");
            return;
          }
        }

        // Image validation for found items
        if (sanitizedFormData.role === "found" && !formData.image) {
          showAlert("error", "Image is required when reporting a found item");
          return;
        }

        setIsSubmitting(true);

        // Upload image if present (with security validation)
        let imageData = null;
        if (formData.image) {
          try {
            // Validate image file security
            securityValidation.validateImageFile(formData.image);
            const uploadResult = await uploadImage(formData.image);
            imageData = uploadResult;
          } catch (uploadError) {
            showAlert("error", `Image upload failed: ${uploadError.message}`);
            setIsSubmitting(false);
            return;
          }
        }

        // Prepare contact info with sanitized data
        const contactInfo = {
          email: sanitizedFormData.email,
          phone: sanitizedFormData.phone,
          preference: sanitizedFormData.contactPreference,
        };

        // Get university information
        const universityInfo = getUserUniversityInfo(user.email);

        // Create comprehensive item document with sanitized data
        const itemData = {
          // Basic item information (sanitized)
          userId: user.uid,
          userEmail: user.email,
          role: sanitizedFormData.role,
          title: sanitizedFormData.title.trim(),
          description: sanitizedFormData.description.trim(),
          category: sanitizedFormData.category,
          location: sanitizedFormData.location.trim(),
          date: sanitizedFormData.date,

          // Contact information (sanitized)
          contact: contactInfo,

          // University information
          university: {
            id: universityInfo?.universityId,
            name: universityInfo?.universityName,
            domain: universityInfo?.universityDomain,
            docId: universityInfo?.docId,
          },

          // Media - Database Base64 storage (security validated)
          image: imageData
            ? {
                type: "database_base64",
                base64: imageData.base64,
                size: imageData.size,
                fileName: imageData.fileName,
                uploadedAt: imageData.uploadedAt,
                uploadedBy: imageData.uploadedBy,
              }
            : null,

          // Legacy field for backward compatibility
          imageUrl: imageData?.base64 || null,

          // Metadata with security timestamps
          createdAt: new Date(),
          updatedAt: new Date(),
          status: "active",

          // Security metadata
          submissionIP: "client-side", // Would need server-side implementation
          userAgent: navigator.userAgent.substring(0, 200), // Limit length

          // Search optimization fields (sanitized)
          titleLower: sanitizedFormData.title.toLowerCase().trim(),
          categoryLower: sanitizedFormData.category.toLowerCase(),
          locationLower: sanitizedFormData.location.toLowerCase().trim(),

          // Analytics fields
          views: 0,
          contactAttempts: 0,

          // Moderation fields
          isVerified: true,
          flagCount: 0,
          isDeleted: false,
        };

        // Final validation before submission
        const validation = testFirebaseStorage.validateItemData(itemData);
        if (!validation.isValid) {
          showAlert("error", "Form data validation failed. Please try again.");
          setIsSubmitting(false);
          return;
        }

        // Load Firestore services lazily
        const [firestoreInstance, { collection, addDoc }] = await Promise.all([
          getFirestore(),
          import("firebase/firestore"),
        ]);

        const docRef = await addDoc(
          collection(firestoreInstance, "items"),
          itemData
        );

        showAlert("success", "Item Reported Successfully!");

        // Clear form data from memory (security measure)
        setFormData({
          role: "",
          title: "",
          description: "",
          category: "",
          location: "",
          date: "",
          email: user?.email || "",
          phone: "",
          contactPreference: "email",
          image: null,
        });
        setImagePreview(null);

        // Delay closing the form so user can see the success message
        setTimeout(() => {
          onSubmit && onSubmit(docRef.id);
          onClose && onClose();
        }, 3000);
      } catch (error) {
        if (error.message.includes("wait 30 seconds")) {
          showAlert("error", error.message);
        } else if (
          error.message.includes("too long") ||
          error.message.includes("required")
        ) {
          showAlert("error", error.message);
        } else {
          showAlert("error", "Failed to submit report. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
        setUploadProgress(0);
      }
    },
    [
      formData,
      user,
      uploadImage,
      onSubmit,
      onClose,
      getUserUniversityInfo,
      showAlert,
      securityValidation,
    ]
  );

  return (
    <div className="report-form-overlay">
      <div className="report-form-container">
        <div className="form-header">
          <h2>Report Item</h2>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          {/* Role Selection */}
          <div className="form-group">
            <label>I have *</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="role"
                  value="lost"
                  checked={formData.role === "lost"}
                  onChange={handleInputChange}
                  required
                />
                <span>Lost an Item</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="role"
                  value="found"
                  checked={formData.role === "found"}
                  onChange={handleInputChange}
                  required
                />
                <span>Found an Item</span>
              </label>
            </div>
          </div>

          {/* Item Title */}
          <div className="form-group">
            <label htmlFor="title">Item Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., UMT ID Card, Black Wallet"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide details: color, unique marks, brand, etc."
              rows="4"
              required
              autoCapitalize="sentences"
              autoComplete="off"
              autoCorrect="on"
              spellCheck="true"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Where was it lost/found?"
              autoCapitalize="words"
              autoComplete="off"
              autoCorrect="on"
              spellCheck="true"
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">
              Date {formData.role === "lost" ? "Lost" : "Found"} *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>
              Image {formData.role === "found" ? "*" : "(Optional)"}
            </label>
            <div className="image-upload-section">
              <div className="upload-buttons">
                <label className="upload-btn hero-btn-primary">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  📁 Choose File
                </label>
                <button
                  type="button"
                  onClick={handleCameraCapture}
                  className="camera-btn hero-btn-secondary"
                >
                  📷 Camera
                </button>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span>{uploadProgress}% uploaded</span>
                </div>
              )}

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  {/* <div className="image-info">
                    {imageInfo && (
                      <div className="compression-info">
                        <small>
                          📦 Size: {imageInfo.compressedSize}MB
                          {imageInfo.compressionRatio > 0 && (
                            <span className="compression-savings">
                              (saved {imageInfo.compressionRatio}%)
                            </span>
                          )}
                        </small>
                        <br />
                        <small className="storage-info">
                          💾 Storage: Database (Base64) - No extra storage costs
                          {imageInfo.compressedSize > 1.5 && (
                            <span className="storage-warning">
                              (Large image - consider using a smaller size for
                              faster loading)
                            </span>
                          )}
                        </small>
                      </div>
                    )}
                  </div> */}
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageInfo(null);
                      setFormData((prev) => ({ ...prev, image: null }));
                    }}
                    className="remove-image"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Contact Preference */}
          <div className="form-group">
            <label>Contact Preference *</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="contactPreference"
                  value="email"
                  checked={formData.contactPreference === "email"}
                  onChange={handleInputChange}
                />
                <span>Email Only</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="contactPreference"
                  value="phone"
                  checked={formData.contactPreference === "phone"}
                  onChange={handleInputChange}
                />
                <span>Phone Only</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="contactPreference"
                  value="both"
                  checked={formData.contactPreference === "both"}
                  onChange={handleInputChange}
                />
                <span>Both</span>
              </label>
            </div>
          </div>

          {/* Email Contact */}
          {(formData.contactPreference === "email" ||
            formData.contactPreference === "both") && (
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your email address"
                required
              />
            </div>
          )}

          {/* Phone Contact */}
          {(formData.contactPreference === "phone" ||
            formData.contactPreference === "both") && (
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="03XX-XXXXXXX or +92-3XX-XXXXXXX"
                required
              />
              <small className="field-hint">
                Pakistani format: 03XX-XXXXXXX or +92-3XX-XXXXXXX
              </small>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn hero-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                {uploadProgress > 0
                  ? `Uploading ${uploadProgress}%...`
                  : "Submitting..."}
              </>
            ) : (
              `Report ${formData.role || "Item"}`
            )}
          </button>
        </form>
      </div>

      {/* Alert Component */}
      <Card
        type={alert.type}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={closeAlert}
      />
    </div>
  );
};

export default ReportItemForm;
