// Login functionality
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            const popup = document.getElementById('success-popup');

            // Hide error message initially
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }

            // Create FormData object
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            // Send AJAX request
            fetch('login_handler.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        if (popup) {
                            const popupMessage = document.getElementById('popup-message');
                            if (popupMessage) {
                                popupMessage.textContent = data.message;
                            }
                            popup.classList.remove('hidden');
                        }
                        setTimeout(() => {
                            window.location.href = data.redirect;
                        }, 2000);
                    } else {
                        if (errorMessage) {
                            errorMessage.textContent = data.message;
                            errorMessage.style.display = 'block';
                        } else {
                            alert(data.message);
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (errorMessage) {
                        errorMessage.textContent = 'An error occurred. Please try again.';
                        errorMessage.style.display = 'block';
                    } else {
                        alert('An error occurred. Please try again.');
                    }
                });
        });
    }

    // Scroll Animations & Navbar Effect
    const header = document.querySelector('header');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    };

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Slightly before it fully enters viewport
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});

// Logout functionality
document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            alert('Logged out successfully!');
            window.location.href = 'index.php?logout=true';
        });
    }
});

// Registration functionality
document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const userType = document.querySelector('input[name="role"]:checked').value;

            const errorMessage = document.getElementById('error-message');
            const successMessage = document.getElementById('success-message');

            // Hide messages
            if (errorMessage) errorMessage.style.display = 'none';
            if (successMessage) successMessage.style.display = 'none';

            // Create FormData object
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('confirm_password', confirmPassword);
            formData.append('role', userType);

            // Send AJAX request
            fetch('register_handler.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const popup = document.getElementById('success-popup');
                        if (popup) {
                            const popupMessage = document.getElementById('popup-message');
                            if (popupMessage) {
                                popupMessage.textContent = data.message;
                            }
                            popup.classList.remove('hidden');
                        }
                        setTimeout(() => {
                            window.location.href = data.redirect;
                        }, 2000);
                    } else {
                        if (errorMessage) {
                            errorMessage.textContent = data.message;
                            errorMessage.style.display = 'block';
                        } else {
                            alert(data.message);
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (errorMessage) {
                        errorMessage.textContent = 'An error occurred. Please try again.';
                        errorMessage.style.display = 'block';
                    } else {
                        alert('An error occurred. Please try again.');
                    }
                });
        });
    }
});

// Translations object
const translations = {
    en: {
        greeting: "Hello! How can I help you today?",
        about: "NE Connect is a platform connecting North East communities with trusted local services. We help you find electricians, plumbers, cleaners, and more by NE people, for NE people.",
        services: "We offer various local services including electricians, plumbers, home cleaning, local shops, and more. You can browse services by category or location.",
        booking: "To book a service, browse our services page, select a provider, and contact them directly. You can also register as a user to save your preferences.",
        contact: "You can contact service providers directly through their profiles. For platform support, visit our contact page or email us at support@neconnect.com.",
        payment: "Payments are handled directly between you and the service provider. We recommend using secure payment methods and keeping records of transactions.",
        safety: "Your safety is our priority. All providers are vetted, and we encourage users to read reviews, verify credentials, and meet in public places when possible.",
        hours: "Service providers set their own hours. Most operate during standard business hours (9 AM - 6 PM), but availability varies. Check provider profiles for exact timings.",
        fallback: "I'm sorry, I didn't understand that. Can you please rephrase or ask about our services, booking, or support?"
    },
    as: {
        greeting: "নমস্কাৰ! আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰি?",
        about: "NE Connect হৈছে এখন প্লেটফৰ্ম যি উত্তৰ-পূৰ্ব সম্প্ৰদায়ক বিশ্বস্ত স্থানীয় সেৱাৰ সৈতে সংযোগ কৰে। আমি আপোনাক বিদ্যুত কৰ্মী, প্লাম্বাৰ, পৰিষ্কাৰকৰ্তা আদি বিচাৰি পোৱাত সহায় কৰোঁ।",
        services: "আমি বিভিন্ন স্থানীয় সেৱা প্ৰদান কৰোঁ যেনে বিদ্যুত কৰ্মী, প্লাম্বাৰ, ঘৰ পৰিষ্কাৰ, স্থানীয় দোকান আদি। আপুনি শ্ৰেণী বা স্থান অনুসৰি সেৱা ব্ৰাউজ কৰিব পাৰে।",
        booking: "সেৱা বুক কৰিবলৈ, আমাৰ সেৱা পৃষ্ঠাত ব্ৰাউজ কৰক, এজন প্ৰদানকৰ্তাক বাছনি কৰক আৰু তেওঁলোকৰ সৈতে প্ৰত্যক্ষভাৱে যোগাযোগ কৰক। আপুনি এজন ব্যৱহাৰকৰ্তা হিচাপে পঞ্জীয়ন কৰি আপোনাৰ পছন্দ সংৰক্ষণ কৰিব পাৰে।",
        contact: "আপুনি সেৱা প্ৰদানকৰ্তাসকলৰ প্ৰফাইলৰ জৰিয়তে প্ৰত্যক্ষভাৱে যোগাযোগ কৰিব পাৰে। প্লেটফৰ্ম সমৰ্থনৰ বাবে, আমাৰ যোগাযোগ পৃষ্ঠাত যাওক বা support@neconnect.com ত যোগাযোগ কৰক।",
        payment: "পেমেন্ট আপুনি আৰু সেৱা প্ৰদানকৰ্তাৰ মাজত প্ৰত্যক্ষভাৱে হয়। আমি সুৰক্ষিত পেমেন্ট পদ্ধতি ব্যৱহাৰ কৰি লেনদেনৰ ৰেকৰ্ড ৰাখিবলৈ পৰামৰ্শ দিওঁ।",
        safety: "আপোনাৰ সুৰক্ষা আমাৰ প্ৰাথমিকতা। সকলো প্ৰদানকৰ্তাক পৰীক্ষা কৰা হয়, আৰু আমি ব্যৱহাৰকৰ্তাসকলক ৰিভিউ পঢ়িবলৈ, ক্ৰেডেনচিয়েল পৰীক্ষা কৰিবলৈ আৰু সম্ভৱ হ'লে পাবলিক স্থানত সাক্ষাৎ কৰিবলৈ উৎসাহিত কৰোঁ।",
        hours: "সেৱা প্ৰদানকৰ্তাসকলে নিজৰ সময় নিৰ্ধাৰণ কৰে। বেছিভাগই মানক ব্যৱসায়িক সময়ত (৯ AM - ৬ PM) কাম কৰে, কিন্তু উপলব্ধতা ভিন্ন হয়। সঠিক সময়ৰ বাবে প্ৰদানকৰ্তাৰ প্ৰফাইল চাওক।",
        fallback: "দুঃখিত, মই সেয়া বুজি নাপালোঁ। অনুগ্ৰহ কৰি পুনৰ ব্যাখ্যা কৰক বা আমাৰ সেৱা, বুকিং বা সমৰ্থনৰ বিষয়ে সোধক।"
    },
    bn: {
        greeting: "হ্যালো! আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
        about: "NE Connect একটি প্ল্যাটফর্ম যা উত্তর-পূর্ব সম্প্রদায়কে বিশ্বস্ত স্থানীয় পরিষেবার সাথে সংযোগ করে। আমরা আপনাকে ইলেকট্রিশিয়ান, প্লাম্বার, ক্লিনার ইত্যাদি খুঁজে পেতে সাহায্য করি।",
        services: "আমরা বিভিন্ন স্থানীয় পরিষেবা প্রদান করি যেমন ইলেকট্রিশিয়ান, প্লাম্বার, হোম ক্লিনিং, লোকাল শপ ইত্যাদি। আপনি ক্যাটাগরি বা লোকেশন অনুসারে পরিষেবা ব্রাউজ করতে পারেন।",
        booking: "পরিষেবা বুক করতে, আমাদের পরিষেবা পৃষ্ঠায় ব্রাউজ করুন, একজন প্রদানকারী নির্বাচন করুন এবং তাদের সাথে সরাসরি যোগাযোগ করুন। আপনি একজন ব্যবহারকারী হিসেবে রেজিস্টার করে আপনার পছন্দ সংরক্ষণ করতে পারেন।",
        contact: "আপনি পরিষেবা প্রদানকারীদের প্রোফাইলের মাধ্যমে সরাসরি যোগাযোগ করতে পারেন। প্ল্যাটফর্ম সাপোর্টের জন্য, আমাদের কন্টাক্ট পেজে যান বা support@neconnect.com এ ইমেল করুন।",
        payment: "পেমেন্ট আপনি এবং পরিষেবা প্রদানকারীর মধ্যে সরাসরি হয়। আমরা নিরাপদ পেমেন্ট পদ্ধতি ব্যবহার এবং লেনদেনের রেকর্ড রাখার পরামর্শ দিই।",
        safety: "আপনার নিরাপত্তা আমাদের অগ্রাধিকার। সকল প্রদানকারীকে যাচাই করা হয়, এবং আমরা ব্যবহারকারীদের রিভিউ পড়তে, ক্রেডেনশিয়াল যাচাই করতে এবং সম্ভব হলে পাবলিক প্লেসে মিট করার জন্য উৎসাহিত করি।",
        hours: "পরিষেবা প্রদানকারীরা তাদের নিজস্ব সময় নির্ধারণ করে। বেশিরভাগই স্ট্যান্ডার্ড বিজনেস আওয়ার্সে (৯ AM - ৬ PM) কাজ করে, কিন্তু উপলব্ধতা ভিন্ন হয়। সঠিক সময়ের জন্য প্রদানকারীর প্রোফাইল চেক করুন।",
        fallback: "দুঃখিত, আমি সেটা বুঝতে পারিনি। অনুগ্রহ করে পুনরায় বলুন বা আমাদের পরিষেবা, বুকিং বা সাপোর্ট সম্পর্কে জিজ্ঞাসা করুন।"
    },
    ne: {
        greeting: "नमस्ते! आज म तपाईलाई कसरी मद्दत गर्न सक्छु?",
        about: "NE Connect एक प्लेटफर्म हो जसले उत्तर-पूर्व समुदायलाई विश्वसनीय स्थानीय सेवाहरूसँग जोड्छ। हामी तपाईलाई इलेक्ट्रिसियन, प्लम्बर, क्लिनर आदिको खोजी गर्न मद्दत गर्दछौं।",
        services: "हामी विभिन्न स्थानीय सेवाहरू प्रदान गर्दछौं जस्तै इलेक्ट्रिसियन, प्लम्बर, होम क्लिनिङ, लोकल सपहरू र थप। तपाईं क्याटेगरी वा स्थान अनुसार सेवाहरू ब्राउज गर्न सक्नुहुन्छ।",
        booking: "सेवा बुक गर्न, हाम्रो सेवाहरू पृष्ठमा ब्राउज गर्नुहोस्, एक प्रदायक छान्नुहोस् र तिनीहरूसँग प्रत्यक्ष सम्पर्क गर्नुहोस्। तपाईं एक प्रयोगकर्ता भएर दर्ता गरेर आफ्नो प्राथमिकता बचत गर्न सक्नुहुन्छ।",
        contact: "तपाईं सेवा प्रदायकहरूको प्रोफाइल मार्फत प्रत्यक्ष सम्पर्क गर्न सक्नुहुन्छ। प्लेटफर्म सपोर्टका लागि, हाम्रो सम्पर्क पृष्ठमा जानुहोस् वा support@neconnect.com मा इमेल गर्नुहोस्।",
        payment: "भुक्तानी तपाईं र सेवा प्रदायक बीच प्रत्यक्ष हुन्छ। हामी सुरक्षित भुक्तानी विधि प्रयोग गर्न र लेनदेनको रेकर्ड राख्न सुझाव दिन्छौं।",
        safety: "तपाईंको सुरक्षा हाम्रो प्राथमिकता हो। सबै प्रदायकहरू प्रमाणित छन्, र हामी प्रयोगकर्ताहरूलाई समीक्षा पढ्न, प्रमाणपत्रहरू प्रमाणित गर्न र सम्भव भएमा सार्वजनिक स्थानमा भेट्न प्रोत्साहित गर्दछौं।",
        hours: "सेवा प्रदायकहरूले आफ्नो समय निर्धारण गर्छन्। धेरैजसोले मानक व्यापारिक घण्टाहरूमा (९ AM - ६ PM) काम गर्छन्, तर उपलब्धता फरक हुन्छ। सही समयका लागि प्रदायकको प्रोफाइल जाँच गर्नुहोस्।",
        fallback: "माफ गर्नुहोस्, मलाई त्यो बुझिएन। कृपया पुनः भन्नुहोस् वा हाम्रा सेवाहरू, बुकिङ वा सपोर्ट बारे सोध्नुहोस्।"
    },
    ma: {
        greeting: "ꯍꯧꯈꯣ! ꯑꯗꯨ ꯑꯩ ꯑꯗꯣꯝꯒꯤ ꯀꯦꯟꯦꯛꯤ ꯃꯇꯦꯡ ꯍꯦꯜꯂꯤ ꯄꯥꯔꯤꯕ ꯍꯦꯜꯂꯤ?",
        about: "NE Connect ꯑꯣꯏꯅ ꯄ꯭ꯂꯦꯠꯐꯣꯔꯝ ꯑꯃꯥ ꯎꯠꯇꯔ-ꯄꯨꯔꯕ ꯁꯝꯄ꯭ꯔꯗꯥꯌꯂꯥꯏ ꯃꯤꯑꯣꯏ ꯁꯦꯕꯥ ꯍꯔꯨ ꯁꯥꯡ ꯁꯝꯒꯣꯡ ꯇꯧꯔꯤ ꯑꯃꯥꯗꯨ ꯑꯩꯗꯨ ꯏꯂꯦꯛꯠ꯭ꯔꯤꯁꯤꯌꯟ, ꯄ꯭ꯂꯥꯝꯕꯔ, ꯀ꯭ꯂꯤꯅꯔ ꯑꯗꯨ ꯍꯦꯜꯂꯤ ꯇꯧꯔꯤ।",
        services: "ꯑꯩꯗꯨ ꯃꯤꯑꯣꯏ ꯁꯦꯕꯥꯍꯔꯨ ꯄ꯭ꯔꯗꯥꯅ ꯇꯧꯔꯤ ꯌꯦꯝ ꯏꯂꯦꯛꯠ꯭ꯔꯤꯁꯤꯌꯟ, ꯄ꯭ꯂꯥꯝꯕꯔ, ꯍꯣꯝ ꯀ꯭ꯂꯤꯅꯤꯡ, ꯂꯣꯀꯜ ꯁꯥꯄ ꯑꯗꯨ ꯃꯇꯦꯡꯒꯤ ꯍꯦꯜꯂꯤ। ꯑꯗꯣꯝ ꯀꯦꯠꯦꯒꯣꯔꯤ ꯅꯃꯁꯤꯡ ꯂꯣꯀꯦꯁꯟ ꯑꯗꯨ ꯁꯦꯕꯥꯍꯔꯨ ꯕ꯭ꯔꯥꯎꯖ ꯇꯧꯔꯤ ꯍꯦꯜꯂꯤ।",
        booking: "ꯁꯦꯕꯥ ꯕꯨꯛ ꯇꯧꯔꯤ, ꯑꯩꯗꯨ ꯁꯦꯕꯥꯍꯔꯨ ꯄꯦꯖ ꯕ꯭ꯔꯥꯎꯖ ꯇꯧꯔꯤ, ꯑꯃꯥ ꯄ꯭ꯔꯣꯕꯥꯏꯗꯔ ꯁꯦꯂꯦꯛꯠ ꯇꯧꯔꯤ ꯑꯗꯨ ꯇꯧꯣꯡꯒꯤ ꯁꯥꯡ ꯁꯝꯒꯣꯡ ꯇꯧꯔꯤ। ꯑꯗꯣꯝ ꯑꯃꯥ ꯌꯨꯖꯔ ꯍꯤꯁꯦꯕ ꯔꯦꯖꯤꯁ꯭ꯠꯔ ꯇꯧꯔꯤ ꯑꯗꯣꯝ ꯄ꯭ꯔꯦꯐꯔꯦꯟ꯭ꯁ ꯁꯦꯕ ꯇꯧꯔꯤ ꯍꯦꯜꯂꯤ।",
        contact: "ꯑꯗꯣꯝ ꯁꯦꯕꯥ ꯄ꯭ꯔꯣꯕꯥꯏꯗꯔꯁꯤꯡ ꯄ꯭ꯔꯣꯐꯥꯏꯜ ꯃꯥꯔꯐꯠ ꯁꯥꯡ ꯁꯝꯒꯣꯡ ꯇꯧꯔꯤ ꯍꯦꯜꯂꯤ। ꯄ꯭ꯂꯦꯠꯐꯣꯔꯝ ꯁꯥꯄꯣꯔꯠ ꯀꯥꯏꯅ, ꯑꯩꯗꯨ ꯀꯣꯟꯇꯦꯛ ꯄꯦꯖ ꯌꯥꯅ ꯅꯃꯁꯤꯡ support@neconnect.com ꯃꯥ ꯏꯃꯦꯜ ꯇꯧꯔꯤ।",
        payment: "ꯄꯦꯃꯦꯟ꯭ꯠ ꯑꯗꯣꯝ ꯑꯗꯨ ꯁꯦꯕꯥ ꯄ꯭ꯔꯣꯕꯥꯏꯗꯔ ꯃꯇꯦꯡ ꯁꯥꯡ ꯁꯝꯒꯣꯡ ꯇꯧꯔꯤ ꯑꯃꯥꯗꯨ ꯁꯨꯔꯛꯁꯤꯠ ꯄꯦꯃꯦꯟ꯭ꯠ ꯃꯦꯊꯣꯗ ꯌꯨꯖ ꯇꯧꯔꯤ ꯑꯗꯨ ꯂꯦꯟꯗꯦꯅ ꯔꯦꯀꯣꯔꯗ ꯔꯥꯛ ꯇꯧꯔꯤ ꯁꯨꯖꯥꯕ ꯇꯧꯔꯤ ꯑꯩꯗꯨ।",
        safety: "ꯑꯗꯣꯝ ꯁꯨꯔꯛꯁꯤꯠ ꯑꯩꯗꯨ ꯄ꯭ꯔꯥꯏꯣꯔꯤꯠꯤ ꯑꯃꯥꯗꯨ ꯁꯕꯥꯏ ꯄ꯭ꯔꯣꯕꯥꯏꯗꯔꯁꯤꯡ ꯚꯦꯠ ꯇꯧꯔꯤ ꯑꯃꯥꯗꯨ ꯑꯩꯗꯨ ꯌꯨꯖꯔꯁꯤꯡ ꯔꯤꯚꯤꯎ ꯄꯥꯔꯤ, ꯀ꯭ꯔꯦꯗꯦꯟꯁꯤꯌꯜ ꯚꯦꯔꯤꯐꯥꯏ ꯇꯧꯔꯤ ꯑꯗꯨ ꯁꯝꯕ ꯍꯦꯜꯂꯤ ꯄꯥꯕ꯭ꯂꯤꯛ ꯄ꯭ꯂꯦꯁ ꯃꯥ ꯃꯤꯠ ꯇꯧꯔꯤ ꯄ꯭ꯔꯣꯠꯁꯥꯍꯤꯠ ꯇꯧꯔꯤ।",
        hours: "ꯁꯦꯕꯥ ꯄ꯭ꯔꯣꯕꯥꯏꯗꯔꯁꯤꯡ ꯇꯧꯣꯡꯒꯤ ꯁꯝꯌ ꯅꯤꯔꯗꯥꯔꯟ ꯇꯧꯔꯤ। ꯃꯦꯔꯥꯏꯁꯣꯂꯦ ꯁ꯭ꯠꯦꯟꯗꯔꯗ ꯕꯤꯖꯅꯦꯁ ꯍꯥꯎꯔꯁ (ꯙ AM - ꯖ PM) ꯃꯥ ꯀꯥꯝ ꯇꯧꯔꯤ, ꯀꯤꯟꯠ ꯎꯄꯜꯕꯗꯍꯤꯠ ꯚꯦꯔꯛ ꯇꯧꯔꯤ। ꯁꯥꯏ ꯁꯝꯌ ꯀꯥꯏꯅ ꯄ꯭ꯔꯣꯕꯥꯏꯗꯔ ꯄ꯭ꯔꯣꯐꯥꯏꯜ ꯆꯦꯛ ꯇꯧꯔꯤ।",
        fallback: "ꯃꯥꯐ ꯇꯧꯔꯤ, ꯑꯩ ꯁꯦꯌꯥ ꯕꯨꯖꯤ ꯅꯥꯄꯥꯂꯤ। ꯀ꯭ꯔꯤꯄꯌꯥ ꯃꯇꯦꯡ ꯂꯥꯏꯔꯤꯕ ꯍꯦꯜꯂꯤ ꯅꯃꯁꯤꯡ ꯑꯩꯗꯨ ꯁꯦꯕꯥꯍꯔꯨ, ꯕꯨꯛꯤꯡ ꯅꯃꯁꯤꯡ ꯁꯥꯄꯣꯔꯠ ꯀꯥꯏꯅ ꯁꯣꯗ ꯇꯧꯔꯤ।"
    },
    mz: {
        greeting: "Chibai! Tûn hi engtin ka hriat theih ang che?",
        about: "NE Connect hi Northeast chhûngte hi service hrang hrang nêna inremna platform a ni. Kan hmun hrang hrang chhûngte hi electrician, plumber, cleaner leh a dangte ka hmu theihnaah kan hriat theih a ni.",
        services: "Kan service hrang hrang pe thei a, electrician, plumber, home cleaning, local shop leh a dangte. Category ne location angin service hrang hrang ka en thei.",
        booking: "Service ka buk duh chuan kan service page-ah ka en a, provider pakhat ka thlang a, an sângin ka contact thei. User angin ka register a, ka preference ka save thei.",
        contact: "Service provider-te profile-ah ka contact thei. Platform support-a kan contact page-ah ka kal ne email support@neconnect.com-ah ka ti thei.",
        payment: "Payment hi nang leh service provider inkara a ni. Payment method secure ka hmang a, transaction record ka nei tur a kan sawi.",
        safety: "Nangmahni safety hi kan priority a ni. Provider zawng zawngte hi ka vet a, user-te review ka chhiar, credential ka verify a, public place-ah ka inrem tur a kan sawi.",
        hours: "Service provider-te an thiltih hun an nei a. Zawng zawngte hi standard business hour (9 AM - 6 PM) ah an thiltih a, availability hi a inang lo. Hun thut tak-a provider profile ka en.",
        fallback: "Ka ngaihdam lo, chu ka hre thei lo. Ka tihfelh rawh ne kan service, booking ne support ka zirtir tur."
    },
    hi: {
        greeting: "नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूँ?",
        about: "NE Connect एक ऐसा प्लेटफॉर्म है जो उत्तर-पूर्व समुदायों को विश्वसनीय स्थानीय सेवाओं से जोड़ता है। हम आपको इलेक्ट्रीशियन, प्लंबर, क्लीनर आदि खोजने में मदद करते हैं।",
        services: "हम विभिन्न स्थानीय सेवाएँ प्रदान करते हैं जैसे इलेक्ट्रीशियन, प्लंबर, होम क्लीनिंग, लोकल शॉप्स आदि। आप श्रेणी या स्थान के अनुसार सेवाओं को ब्राउज़ कर सकते हैं।",
        booking: "सेवा बुक करने के लिए, हमारी सेवाएँ पेज पर ब्राउज़ करें, एक प्रदाता चुनें और सीधे उनसे संपर्क करें। आप एक उपयोगकर्ता के रूप में पंजीकरण करके अपनी प्राथमिकताएँ सहेज सकते हैं।",
        contact: "आप सेवा प्रदाताओं के प्रोफाइल के माध्यम से सीधे संपर्क कर सकते हैं। प्लेटफॉर्म सहायता के लिए, हमारे संपर्क पेज पर जाएँ या support@neconnect.com पर ईमेल करें।",
        payment: "भुगतान आप और सेवा प्रदाता के बीच सीधे होता है। हम सुरक्षित भुगतान विधियों का उपयोग करने और लेनदेन के रिकॉर्ड रखने की सलाह देते हैं।",
        safety: "आपकी सुरक्षा हमारी प्राथमिकता है। सभी प्रदाताओं की जांच की जाती है, और हम उपयोगकर्ताओं को समीक्षाएँ पढ़ने, क्रेडेंशियल्स सत्यापित करने और संभव होने पर सार्वजनिक स्थानों में मिलने के लिए प्रोत्साहित करते हैं।",
        hours: "सेवा प्रदाताओं द्वारा अपना समय निर्धारित किया जाता है। अधिकांश मानक व्यावसायिक घंटों (9 AM - 6 PM) में काम करते हैं, लेकिन उपलब्धता अलग-अलग होती है। सटीक समय के लिए प्रदाता प्रोफाइल देखें।",
        fallback: "क्षमा करें, मुझे वह समझ नहीं आया। कृपया पुनः कहें या हमारी सेवाओं, बुकिंग या सहायता के बारे में पूछें।"
    },
    kh: {
        greeting: "Kumno! Wat haduh ka pynleit ia nga?",
        about: "NE Connect ka dei ka platform ba ka pyniap ia ka jingtrei kaba khraw eh ha ka ri Khasi bad ka ri Garo bad ki jingthmu ba khraw eh. Ngim pynleit ia phi ba pynshong ia ki electrician, plumber, cleaner bad kiwei pat ki jingthmu.",
        services: "Ngim pyni ia ki jingthmu ba khraw eh ba ki dei electrician, plumber, home cleaning, local shops bad kiwei pat. Phi lah ban pynshong ia ki jingthmu ha ka category ne location.",
        booking: "Ba ban book ia ka jingthmu, pynshong ia ka page jingthmu jong ngi, pynshong ia ka provider bad pyniap ia u direct. Phi lah ban register shaphang ka user bad pynlong ia ka jingpynshong jong phi.",
        contact: "Phi lah ban pyniap ia ki provider ba ki jingthmu ha ka profile jong ki. Ba ka platform support, wan ha ka page contact jong ngi ne email ia ngi ha support@neconnect.com.",
        payment: "Ka jingpynrem jong ka jingthmu ka dei ha baroh phi bad ka provider. Ngim nia ia phi ba pynrem ha ka jingpynrem ba khraw eh bad pynlong ia ka jingpynrem record.",
        safety: "Ka jingkhraw jong phi ka dei ka jingpynleit kaba khraw eh ba ngi dei. Ki provider baroh ki dei ka vet, bad ngim nia ia ki user ba pynshong ia ki review, pyniap ia ki credential bad wan ha ki jaka public lada lah.",
        hours: "Ki provider ba ki jingthmu ki dei ka jingpynlong ka jingpynrem jong ki. Kiwei pat ki dei ka jingthmu ha ka standard business hours (9 AM - 6 PM), hynrei ka jingpynrem ka dei ka jingpynshong. Pynshong ia ka profile provider ba ka jingpynrem thik.",
        fallback: "Ngam tip, nga la hikai. Phi lah ban ong khlem ne pynshong shaphang ki jingthmu, booking ne support jong ngi."
    },
    gr: {
        greeting: "Nama! Wat haduh ka pynleit ia nga?",
        about: "NE Connect ka dei ka platform ba ka pyniap ia ka jingtrei kaba khraw eh ha ka ri Khasi bad ka ri Garo bad ki jingthmu ba khraw eh. Ngim pynleit ia phi ba pynshong ia ki electrician, plumber, cleaner bad kiwei pat ki jingthmu.",
        services: "Ngim pyni ia ki jingthmu ba khraw eh ba ki dei electrician, plumber, home cleaning, local shops bad kiwei pat. Phi lah ban pynshong ia ki jingthmu ha ka category ne location.",
        booking: "Ba ban book ia ka jingthmu, pynshong ia ka page jingthmu jong ngi, pynshong ia ka provider bad pyniap ia u direct. Phi lah ban register shaphang ka user bad pynlong ia ka jingpynshong jong phi.",
        contact: "Phi lah ban pyniap ia ki provider ba ki jingthmu ha ka profile jong ki. Ba ka platform support, wan ha ka page contact jong ngi ne email ia ngi ha support@neconnect.com.",
        payment: "Ka jingpynrem jong ka jingthmu ka dei ha baroh phi bad ka provider. Ngim nia ia phi ba pynrem ha ka jingpynrem ba khraw eh bad pynlong ia ka jingpynrem record.",
        safety: "Ka jingkhraw jong phi ka dei ka jingpynleit kaba khraw eh ba ngi dei. Ki provider baroh ki dei ka vet, bad ngim nia ia ki user ba pynshong ia ki review, pyniap ia ki credential bad wan ha ki jaka public lada lah.",
        hours: "Ki provider ba ki jingthmu ki dei ka jingpynlong ka jingpynrem jong ki. Kiwei pat ki dei ka jingthmu ha ka standard business hours (9 AM - 6 PM), hynrei ka jingpynrem ka dei ka jingpynshong. Pynshong ia ka profile provider ba ka jingpynrem thik.",
        fallback: "Ngam tip, nga la hikai. Phi lah ban ong khlem ne pynshong shaphang ki jingthmu, booking ne support jong ngi."
    },
    kb: {
        greeting: "Kokborok! Wat haduh ka pynleit ia nga?",
        about: "NE Connect ka dei ka platform ba ka pyniap ia ka jingtrei kaba khraw eh ha ka ri Khasi bad ka ri Garo bad ki jingthmu ba khraw eh. Ngim pynleit ia phi ba pynshong ia ki electrician, plumber, cleaner bad kiwei pat ki jingthmu.",
        services: "Ngim pyni ia ki jingthmu ba khraw eh ba ki dei electrician, plumber, home cleaning, local shops bad kiwei pat. Phi lah ban pynshong ia ki jingthmu ha ka category ne location.",
        booking: "Ba ban book ia ka jingthmu, pynshong ia ka page jingthmu jong ngi, pynshong ia ka provider bad pyniap ia u direct. Phi lah ban register shaphang ka user bad pynlong ia ka jingpynshong jong phi.",
        contact: "Phi lah ban pyniap ia ki provider ba ki jingthmu ha ka profile jong ki. Ba ka platform support, wan ha ka page contact jong ngi ne email ia ngi ha support@neconnect.com.",
        payment: "Ka jingpynrem jong ka jingthmu ka dei ha baroh phi bad ka provider. Ngim nia ia phi ba pynrem ha ka jingpynrem ba khraw eh bad pynlong ia ka jingpynrem record.",
        safety: "Ka jingkhraw jong phi ka dei ka jingpynleit kaba khraw eh ba ngi dei. Ki provider baroh ki dei ka vet, bad ngim nia ia ki user ba pynshong ia ki review, pyniap ia ki credential bad wan ha ki jaka public lada lah.",
        hours: "Ki provider ba ki jingthmu ki dei ka jingpynlong ka jingpynrem jong ki. Kiwei pat ki dei ka jingthmu ha ka standard business hours (9 AM - 6 PM), hynrei ka jingpynrem ka dei ka jingpynshong. Pynshong ia ka profile provider ba ka jingpynrem thik.",
        fallback: "Ngam tip, nga la hikai. Phi lah ban ong khlem ne pynshong shaphang ki jingthmu, booking ne support jong ngi."
    },
    ku: {
        greeting: "Kuki! Wat haduh ka pynleit ia nga?",
        about: "NE Connect ka dei ka platform ba ka pyniap ia ka jingtrei kaba khraw eh ha ka ri Khasi bad ka ri Garo bad ki jingthmu ba khraw eh. Ngim pynleit ia phi ba pynshong ia ki electrician, plumber, cleaner bad kiwei pat ki jingthmu.",
        services: "Ngim pyni ia ki jingthmu ba khraw eh ba ki dei electrician, plumber, home cleaning, local shops bad kiwei pat. Phi lah ban pynshong ia ki jingthmu ha ka category ne location.",
        booking: "Ba ban book ia ka jingthmu, pynshong ia ka page jingthmu jong ngi, pynshong ia ka provider bad pyniap ia u direct. Phi lah ban register shaphang ka user bad pynlong ia ka jingpynrem jong phi.",
        contact: "Phi lah ban pyniap ia ki provider ba ki jingthmu ha ka profile jong ki. Ba ka platform support, wan ha ka page contact jong ngi ne email ia ngi ha support@neconnect.com.",
        payment: "Ka jingpynrem jong ka jingthmu ka dei ha baroh phi bad ka provider. Ngim nia ia phi ba pynrem ha ka jingpynrem ba khraw eh bad pynlong ia ka jingpynrem record.",
        safety: "Ka jingkhraw jong phi ka dei ka jingpynleit kaba khraw eh ba ngi dei. Ki provider baroh ki dei ka vet, bad ngim nia ia ki user ba pynshong ia ki review, pyniap ia ki credential bad wan ha ki jaka public lada lah.",
        hours: "Ki provider ba ki jingthmu ki dei ka jingpynlong ka jingpynrem jong ki. Kiwei pat ki dei ka jingthmu ha ka standard business hours (9 AM - 6 PM), hynrei ka jingpynrem ka dei ka jingpynshong. Pynshong ia ka profile provider ba ka jingpynrem thik.",
        fallback: "Ngam tip, nga la hikai. Phi lah ban ong khlem ne pynshong shaphang ki jingthmu, booking ne support jong ngi."
    },
    ng: {
        greeting: "Naga! Wat haduh ka pynleit ia nga?",
        about: "NE Connect ka dei ka platform ba ka pyniap ia ka jingtrei kaba khraw eh ha ka ri Khasi bad ka ri Garo bad ki jingthmu ba khraw eh. Ngim pynleit ia phi ba pynshong ia ki electrician, plumber, cleaner bad kiwei pat ki jingthmu.",
        services: "Ngim pyni ia ki jingthmu ba khraw eh ba ki dei electrician, plumber, home cleaning, local shops bad kiwei pat. Phi lah ban pynshong ia ki jingthmu ha ka category ne location.",
        booking: "Ba ban book ia ka jingthmu, pynshong ia ka page jingthmu jong ngi, pynshong ia ka provider bad pyniap ia u direct. Phi lah ban register shaphang ka user bad pynlong ia ka jingpynrem jong phi.",
        contact: "Phi lah ban pyniap ia ki provider ba ki jingthmu ha ka profile jong ki. Ba ka platform support, wan ha ka page contact jong ngi ne email ia ngi ha support@neconnect.com.",
        payment: "Ka jingpynrem jong ka jingthmu ka dei ha baroh phi bad ka provider. Ngim nia ia phi ba pynrem ha ka jingpynrem ba khraw eh bad pynlong ia ka jingpynrem record.",
        safety: "Ka jingkhraw jong phi ka dei ka jingpynleit kaba khraw eh ba ngi dei. Ki provider baroh ki dei ka vet, bad ngim nia ia ki user ba pynshong ia ki review, pyniap ia ki credential bad wan ha ki jaka public lada lah.",
        hours: "Ki provider ba ki jingthmu ki dei ka jingpynlong ka jingpynrem jong ki. Kiwei pat ki dei ka jingthmu ha ka standard business hours (9 AM - 6 PM), hynrei ka jingpynrem ka dei ka jingpynshong. Pynshong ia ka profile provider ba ka jingpynrem thik.",
        fallback: "Ngam tip, nga la hikai. Phi lah ban ong khlem ne pynshong shaphang ki jingthmu, booking ne support jong ngi."
    },
    ar: {
        greeting: "Arunachali! Wat haduh ka pynleit ia nga?",
        about: "NE Connect ka dei ka platform ba ka pyniap ia ka jingtrei kaba khraw eh ha ka ri Khasi bad ka ri Garo bad ki jingthmu ba khraw eh. Ngim pynleit ia phi ba pynshong ia ki electrician, plumber, cleaner bad kiwei pat ki jingthmu.",
        services: "Ngim pyni ia ki jingthmu ba khraw eh ba ki dei electrician, plumber, home cleaning, local shops bad kiwei pat. Phi lah ban pynshong ia ki jingthmu ha ka category ne location.",
        booking: "Ba ban book ia ka jingthmu, pynshong ia ka page jingthmu jong ngi, pynshong ia ka provider bad pyniap ia u direct. Phi lah ban register shaphang ka user bad pynlong ia ka jingpynrem jong phi.",
        contact: "Phi lah ban pyniap ia ki provider ba ki jingthmu ha ka profile jong ki. Ba ka platform support, wan ha ka page contact jong ngi ne email ia ngi ha support@neconnect.com.",
        payment: "Ka jingpynrem jong ka jingthmu ka dei ha baroh phi bad ka provider. Ngim nia ia phi ba pynrem ha ka jingpynrem ba khraw eh bad pynlong ia ka jingpynrem record.",
        safety: "Ka jingkhraw jong phi ka dei ka jingpynleit kaba khraw eh ba ngi dei. Ki provider baroh ki dei ka vet, bad ngim nia ia ki user ba pynshong ia ki review, pyniap ia ki credential bad wan ha ki jaka public lada lah.",
        hours: "Ki provider ba ki jingthmu ki dei ka jingpynlong ka jingpynrem jong ki. Kiwei pat ki dei ka jingthmu ha ka standard business hours (9 AM - 6 PM), hynrei ka jingpynrem ka dei ka jingpynshong. Pynshong ia ka profile provider ba ka jingpynrem thik.",
        fallback: "Ngam tip, nga la hikai. Phi lah ban ong khlem ne pynshong shaphang ki jingthmu, booking ne support jong ngi."
    }
};

// Intents array
const intents = [
    { intent: 'greeting', keywords: ['hi', 'hello', 'hey', 'namaste', 'chibai', 'kumno', 'nama', 'kokborok', 'kuki', 'naga', 'arunachali'], response: 'greeting' },
    { intent: 'about', keywords: ['what is ne connect', 'about ne connect', 'what is this', 'about us', 'who are you'], response: 'about' },
    { intent: 'services', keywords: ['services', 'what services', 'available services', 'electrician', 'plumber', 'cleaner', 'shops'], response: 'services' },
    { intent: 'booking', keywords: ['book', 'booking', 'how to book', 'reserve', 'schedule'], response: 'booking' },
    { intent: 'contact', keywords: ['contact', 'how to contact', 'reach', 'email', 'phone'], response: 'contact' },
    { intent: 'payment', keywords: ['payment', 'pay', 'how to pay', 'fees', 'cost'], response: 'payment' },
    { intent: 'safety', keywords: ['safety', 'trust', 'secure', 'safe', 'reviews'], response: 'safety' },
    { intent: 'hours', keywords: ['hours', 'time', 'when open', 'working hours', 'availability'], response: 'hours' }
];

// Chatbot functionality
document.addEventListener('DOMContentLoaded', function () {
    // Chatbot variables
    let currentLanguage = 'en';

    // DOM elements
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotPanel = document.getElementById('chatbot-panel');
    const closeChatbot = document.getElementById('close-chatbot');
    const languageSelect = document.getElementById('language-select');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Event listeners
    chatbotButton.addEventListener('click', toggleChatbot);
    closeChatbot.addEventListener('click', toggleChatbot);
    languageSelect.addEventListener('change', changeLanguage);
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Functions
    function toggleChatbot() {
        chatbotPanel.classList.toggle('hidden');
        if (!chatbotPanel.classList.contains('hidden')) {
            userInput.focus();
            if (chatMessages.children.length === 0) {
                addBotMessage(translations[currentLanguage].greeting);
            }
        }
    }

    function changeLanguage() {
        currentLanguage = languageSelect.value;
        // Clear messages and greet in new language
        chatMessages.innerHTML = '';
        addBotMessage(translations[currentLanguage].greeting);
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        addUserMessage(message);
        userInput.value = '';

        const response = getBotResponse(message.toLowerCase());
        setTimeout(() => addBotMessage(response), 500); // Simulate typing delay
    }

    function getBotResponse(message) {
        // Detect intent
        let detectedIntent = null;
        for (let intent of intents) {
            for (let keyword of intent.keywords) {
                if (message.includes(keyword)) {
                    detectedIntent = intent;
                    break;
                }
            }
            if (detectedIntent) break;
        }

        if (detectedIntent) {
            return translations[currentLanguage][detectedIntent.response] || translations.en[detectedIntent.response];
        } else {
            return translations[currentLanguage].fallback || translations.en.fallback;
        }
    }

    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});