import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// --- Realistic Northeast India Data Models ---
const STATES = [
    { name: "Assam", cities: ["Guwahati", "Dibrugarh", "Silchar", "Tezpur", "Jorhat", "Nagaon", "Tinsukia"] },
    { name: "Meghalaya", cities: ["Shillong", "Tura", "Jowai", "Nongpoh", "Williamnagar"] },
    { name: "Mizoram", cities: ["Aizawl", "Lunglei", "Champhai", "Kolasib", "Serchhip"] },
    { name: "Nagaland", cities: ["Dimapur", "Kohima", "Mokokchung", "Tuensang", "Wokha"] },
    { name: "Manipur", cities: ["Imphal", "Churachandpur", "Thoubal", "Kakching", "Ukhrul"] },
    { name: "Arunachal Pradesh", cities: ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro"] },
    { name: "Tripura", cities: ["Agartala", "Dharmanagar", "Udaipur", "Kailashahar", "Ambassa"] },
    { name: "Sikkim", cities: ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Singtam"] }
]

const NAMES = {
    "Assam": ["Bikash Das", "Ranjit Sharma", "Dipankar Kalita", "Pallavi Dutta", "Anil Barman", "Sanjay Gogoi", "Rekha Boro", "Rupam Nath", "Hemanta Baruah", "Jahnabi Saikia"],
    "Meghalaya": ["David K.", "John Sangma", "Anita Lyngdoh", "Robert Marak", "Grace Kharkongor", "Daniel Syiem", "Mary Dkhar", "Pynskhem L.", "Banrove S.", "Iashan K."],
    "Mizoram": ["Lalrinmawia", "Zothansanga", "Lalhmangaihi", "Vanlalhruaia", "Malsawmtluanga", "Rohlua", "Lalpuii", "Remfela", "Zuali P.", "Thanga L."],
    "Nagaland": ["James Zeliang", "Arenla Ao", "Kuolie Angami", "Keneisenuo", "Imkong", "Vikuo", "Asangla", "Kezha", "Sentimong", "Lanu."],
    "Manipur": ["Biren Singh", "Sanatombi Devi", "Thoiba Singh", "Ranjita Devi", "Khelen", "Sarat", "Binita", "Ibohal", "Memcha", "Nanao"],
    "Arunachal Pradesh": ["Taba K.", "Lobsang T", "Tage N.", "Pema D.", "Nima W.", "Chukhu", "Bem", "Dani", "Koji", "Michi"],
    "Tripura": ["Subrata Debnath", "Pradip Saha", "Moumita Das", "Bikram Tripura", "Raju Reang", "Suman Jamatia", "Anjali Roy", "Uttam Deb", "Kanika M."],
    "Sikkim": ["Karma Bhutia", "Passang Sherpa", "Sunil Chettri", "Rinzing Lepcha", "Pooja Gurung", "Sonam Tamang", "Mingma L.", "Tshering D.", "Pemba G."]
}

const CATEGORIES = [
    { name: "Home Services", desc: "Essential repairs and maintenance", img: "home" },
    { name: "Appliance Repair", desc: "Expert technicians for electronics", img: "appliance" },
    { name: "Tech Services", desc: "Gadget repairs and installations", img: "tech" },
    { name: "Personal Services", desc: "Care, driving, and tutoring", img: "personal" },
    { name: "Outdoor Services", desc: "Gardening and heavy maintenance", img: "outdoor" }
]

const SERVICES = {
    "Home Services": [
        { name: "Electrician", basePrice: 149, time: 60, desc: "Wiring, switch repairs, fault finding." },
        { name: "Plumber", basePrice: 199, time: 60, desc: "Leak fixing, pipe fitting, blockages." },
        { name: "Carpenter", basePrice: 299, time: 120, desc: "Furniture assembly, door repairs." },
        { name: "Painter", basePrice: 499, time: 240, desc: "Wall painting, touch-ups." },
        { name: "House Cleaning", basePrice: 599, time: 180, desc: "Deep cleaning for apartments." }
    ],
    "Appliance Repair": [
        { name: "AC Repair", basePrice: 399, time: 90, desc: "Gas refill, servicing, repairs." },
        { name: "Refrigerator Repair", basePrice: 349, time: 90, desc: "Cooling issues, compressor check." },
        { name: "Washing Machine Repair", basePrice: 299, time: 60, desc: "Drum issues, motor fixing." },
        { name: "TV Repair", basePrice: 499, time: 120, desc: "Screen issues, board repairs." },
        { name: "Water Purifier Service", basePrice: 249, time: 45, desc: "Filter change, deep clean." }
    ],
    "Tech Services": [
        { name: "Mobile Repair", basePrice: 199, time: 60, desc: "Screen replacement, battery fix." },
        { name: "Laptop Repair", basePrice: 499, time: 120, desc: "OS install, hardware issues." },
        { name: "WiFi Installation", basePrice: 249, time: 90, desc: "Router setup, cabling." },
        { name: "CCTV Installation", basePrice: 999, time: 240, desc: "Camera setup, wiring, network." }
    ],
    "Personal Services": [
        { name: "Home Tutor", basePrice: 499, time: 60, desc: "Maths, Science, English tutoring." },
        { name: "Babysitter", basePrice: 299, time: 60, desc: "Hourly childcare services." },
        { name: "Elderly Care", basePrice: 399, time: 60, desc: "Companionship and basic care." }
    ],
    "Outdoor Services": [
        { name: "Gardening", basePrice: 299, time: 120, desc: "Lawn care, planting, trimming." },
        { name: "Pest Control", basePrice: 799, time: 120, desc: "Termite, cockroach, rodent control." },
        { name: "Water Tank Cleaning", basePrice: 599, time: 90, desc: "Deep scrub and sanitization." }
    ]
}

const AVATARS = [
    "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&q=80"
]

// Utilities
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomItems = <T>(arr: T[], count: number): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function main() {
    console.log(`🗑️  Clearing existing database...`)
    await prisma.availability.deleteMany()
    await prisma.providerDocument.deleteMany()
    await prisma.message.deleteMany()
    await prisma.supportTicket.deleteMany()
    await prisma.payment.deleteMany()
    await prisma.review.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.service.deleteMany()
    await prisma.category.deleteMany()
    await prisma.providerProfile.deleteMany()
    await prisma.user.deleteMany()

    console.log(`\n📁 Seeding Categories...`)
    const categoryMap = new Map<string, string>()
    for (const cat of CATEGORIES) {
        const createdCat = await prisma.category.create({
            data: { name: cat.name, description: cat.desc, image: cat.img }
        })
        categoryMap.set(cat.name, createdCat.id)
    }

    const HASH_ROUNDS = 10
    const commonPassword = await bcrypt.hash("Provider@12345", HASH_ROUNDS)
    const userPassword = await bcrypt.hash("User@12345", HASH_ROUNDS)
    const adminPassword = await bcrypt.hash("Admin@12345", HASH_ROUNDS)

    console.log(`\n🛡️  Generating Admin & Standard Demo Accounts...`)
    
    // Admin
    await prisma.user.create({
        data: {
            name: "Master Admin",
            email: "admin@ne-connect.com",
            password: adminPassword,
            role: "ADMIN"
        }
    })

    // Standard User Demo
    const demoUser = await prisma.user.create({
        data: {
            name: "Rahul Sharma",
            email: "rahul.user@ne-connect.com",
            password: userPassword,
            role: "USER",
            state: "Assam",
            city: "Guwahati"
        }
    })

    // Subagent/Legacy Demo (needed for verification workflows)
    await prisma.user.create({
        data: {
            name: "Test Customer",
            email: "customer@example.com",
            password: userPassword,
            role: "USER",
            state: "Assam",
            city: "Guwahati"
        }
    })

    // Standard Provider Demo
    const demoProviderUser = await prisma.user.create({
        data: {
            name: "Lalrinmawia",
            email: "lalrinmawia.provider@ne-connect.com",
            password: commonPassword,
            role: "PROVIDER",
            state: "Mizoram",
            city: "Aizawl"
        }
    })

    const demoProviderProfile = await prisma.providerProfile.create({
        data: {
            userId: demoProviderUser.id,
            businessName: "Mizo Pro Services",
            bio: "Standard demo provider for Mizo Pro Services. Expert in local maintenance.",
            experience: 8,
            verified: true,
            languages: "English, Mizo, Hindi",
            stateServed: "Mizoram",
            citiesServed: "Aizawl"
        }
    })

    // Add a service for the demo provider
    await prisma.service.create({
        data: {
            name: "General Maintenance",
            description: "All-in-one maintenance for homes.",
            price: 499,
            estimatedTime: 60,
            categoryId: categoryMap.values().next().value!,
            providerId: demoProviderProfile.id,
            state: "Mizoram",
            city: "Aizawl"
        }
    })

    console.log(`\n🏗️  Generating 10 High-Quality Providers across Northeast States...`)
    const providerIds: string[] = [demoProviderProfile.id]

    // Generate 9 more providers to make it exactly 10
    for (let i = 0; i < 9; i++) {
        const stateObj = getRandomItem(STATES)
        const stateName = stateObj.name
        const city = getRandomItem(stateObj.cities)
        const namePool = NAMES[stateName as keyof typeof NAMES]
        const fullName = getRandomItem(namePool)
        const email = `provider${i}@neconnect.in`
        const phone = `+919875${String(i).padStart(6, '0')}`
        const avatar = getRandomItem(AVATARS)

        const user = await prisma.user.create({
            data: { 
                name: fullName, 
                email, 
                phone, 
                image: avatar, 
                role: "PROVIDER",
                password: commonPassword,
                state: stateName,
                city
            }
        })

        const isVerified = true // Make them all verified for a better "10 best" feel
        const expYears = getRandomInt(5, 15)
        const langs = ["English", "Hindi"]
        if (stateName === "Assam") langs.push("Assamese")
        if (stateName === "Mizoram") langs.push("Mizo")
        if (stateName === "Meghalaya") langs.push("Khasi", "Garo")
        if (stateName === "Manipur") langs.push("Manipuri")
        if (stateName === "Nagaland") langs.push("Nagamese")
        if (stateName === "Tripura") langs.push("Bengali")
        if (stateName === "Sikkim") langs.push("Nepali")
        const providerLangs = getRandomItems(langs, getRandomInt(2, 4)).join(", ")

        const profile = await prisma.providerProfile.create({
            data: {
                userId: user.id,
                businessName: `${fullName.split(' ')[0]}'s Professional ${getRandomItem(["Fix", "Services", "Pro", "Works", "Hub"])}`,
                bio: `Top-rated marketplace professional in ${city}, ${stateName}. With ${expYears} years of expertise, I deliver exceptional ${getRandomItem(["maintenance", "solutions", "support", "care"])} with 100% satisfaction guarantee. Certified and highly reliable.`,
                experience: expYears,
                verified: isVerified,
                languages: providerLangs,
                stateServed: stateName,
                citiesServed: city
            }
        })
        providerIds.push(profile.id)

        // Add 2-3 services for each of these 10 providers
        const selectedCats = getRandomItems(CATEGORIES, getRandomInt(1, 2))
        for (const cat of selectedCats) {
            const categoryId = categoryMap.get(cat.name)!
            const availableServices = SERVICES[cat.name as keyof typeof SERVICES]
            const selectedServices = getRandomItems(availableServices, getRandomInt(1, 2))

            for (const s of selectedServices) {
                const actualPrice = s.basePrice + (getRandomInt(0, 3) * 50)
                await prisma.service.create({
                    data: {
                        name: s.name, 
                        description: `${s.desc} Premium professional service in ${city}.`,
                        price: actualPrice,
                        estimatedTime: s.time, 
                        categoryId, 
                        providerId: profile.id,
                        state: stateName, 
                        city
                    }
                })
            }
        }

        // Add weekly availability slots
        for (let day = 1; day <= 6; day++) { // Mon-Sat
            await prisma.availability.create({
                data: {
                    providerId: profile.id,
                    dayOfWeek: day,
                    startTime: "09:00",
                    endTime: "19:00",
                    isAvailable: true
                }
            })
        }

        console.log(`  Generated provider ${i + 2}/10: ${fullName}`)
    }

    console.log(`\n👥 Generating Users & Reviews...`)
    const userIds: string[] = [demoUser.id]
    for (let u = 0; u < 50; u++) {
        const user = await prisma.user.create({
            data: {
                name: `User ${u + 1}`,
                email: `user${u}@test.com`,
                password: userPassword,
                role: "USER"
            }
        })
        userIds.push(user.id)
    }

    const reviewComments = [
        "Excellent service, very professional.",
        "Arrived on time and did a great job.",
        "Highly recommended for anyone in the area.",
        "Fair pricing and quality work.",
        "Very knowledgeable and polite.",
        "Fixed the issue quickly.",
        "Great experience overall!",
        "Very satisfied with the result.",
        "Will definitely book again.",
        "Impressive attention to detail."
    ]

    for (const pid of providerIds) {
        if (Math.random() > 0.1) {
            const numReviews = getRandomInt(1, 8)
            for (let r = 0; r < numReviews; r++) {
                await prisma.review.create({
                    data: {
                        rating: Math.random() > 0.2 ? getRandomInt(4, 5) : getRandomInt(3, 4),
                        comment: getRandomItem(reviewComments),
                        userId: getRandomItem(userIds),
                        providerId: pid
                    }
                })
            }
        }
    }

    console.log(`\n✨ Seeding complete! 210 Providers and 50 Users generated including standard demo accounts.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
