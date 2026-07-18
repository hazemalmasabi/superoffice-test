// SuperOffice Database Engine (Local Storage persistent simulation)

const DEFAULT_BRANCHES = [
    { id: 1, name: "العارض", address: "طريق الملك عبدالعزيز، حي العارض، الرياض", code: "al-aarid" },
    { id: 4, name: "السويدي", address: "شارع صيدا، حي الدريهمية، الرياض", code: "suwaidi" },
    { id: 9, name: "الروضة", address: "طريق خريص الفرعي، حي الروضة، الرياض", code: "Al-Rawdah" }
];

const DEFAULT_SPACES = [
    { id: 890, name: "مكتب خاص 8-CD", branchId: 1, type: "private-office", capacity: "1-4", price: 5200, pricePeriod: "شهر", state: 1, image: "https://superoffice.sa/uploads/offices/1721640105.webp" },
    { id: 887, name: "مكتب خاص 7-GH", branchId: 1, type: "private-office", capacity: "1-6", price: 6500, pricePeriod: "شهر", state: 1, image: "https://superoffice.sa/uploads/offices/1721636807.webp" },
    { id: 884, name: "مكتب خاص 7-CD", branchId: 1, type: "private-office", capacity: "1-6", price: 5300, pricePeriod: "شهر", state: 1, image: "https://superoffice.sa/uploads/offices/1721636653.webp" },
    { id: 901, name: "مساحة عمل مشتركة (عضوية سنوية)", branchId: 1, type: "coworking-space", capacity: "1", price: 4599, pricePeriod: "سنة", state: 1, image: "https://superoffice.sa/uploads/offices/1722154211.webp" },
    { id: 902, name: "مكتب افتراضي بلاتيني (توثيق إيجار)", branchId: 9, type: "virtual-office", capacity: "1", price: 9900, pricePeriod: "سنة", state: 1, image: "https://superoffice.sa/uploads/offices/1722156725.webp" },
    { id: 903, name: "مستودع تخزين آمن للمواد", branchId: 4, type: "warehouse", capacity: "10-20", price: 200, pricePeriod: "متر مربع/شهر", state: 2, image: "https://superoffice.sa/uploads/pages/item_1_148.webp" },
    { id: 904, name: "قاعة اجتماعات 11-E الفاخرة", branchId: 1, type: "meeting-room", capacity: "11-14", price: 150, pricePeriod: "ساعة", state: 1, image: "https://superoffice.sa/uploads/pages/video1757572854.jpg" },
    { id: 905, name: "غرفة اجتماعات Z-03 الصغيرة", branchId: 4, type: "meeting-room", capacity: "2-5", price: 80, pricePeriod: "ساعة", state: 1, image: "https://superoffice.sa/uploads/pages/video1757572911.jpg" }
];

const DEFAULT_INVOICES = [
    { id: "INV-1001", clientName: "شركة التقنية الذكية", type: "مكتب خاص 8-CD", amount: 5200, date: "2026-07-01", dueDate: "2026-08-01", status: "unpaid" },
    { id: "INV-1002", clientName: "أحمد العتيبي", type: "مساحة عمل مشتركة", amount: 4599, date: "2026-05-10", dueDate: "2026-05-10", status: "paid" },
    { id: "INV-1003", clientName: "مؤسسة الابتكار", type: "مكتب افتراضي بلاتيني", amount: 9900, date: "2026-06-15", dueDate: "2026-06-15", status: "paid" }
];

const DEFAULT_BOOKINGS = [
    { id: "BK-501", clientName: "شركة التقنية الذكية", type: "مكتب خاص 8-CD", branch: "العارض", startDate: "2026-07-01", endDate: "2026-10-01", amount: 15600, status: "نشط" }
];

const DEFAULT_CHATS = [
    { id: "chat-1", clientName: "شركة التقنية الذكية", clientEmail: "tech@smart.com", messages: [
        { sender: "client", text: "السلام عليكم، نود الاستفسار عن كفاءة تكييف مكتب 8-CD؟", time: "2026-07-18T09:00:00" },
        { sender: "admin", text: "وعليكم السلام، تم عمل صيانة شاملة للمكيفات بالأمس وهي تعمل بكفاءة تامة.", time: "2026-07-18T09:10:00" }
    ]}
];

// Initialize DB if not exists
function initDB() {
    if (!localStorage.getItem("so_branches")) {
        localStorage.setItem("so_branches", JSON.stringify(DEFAULT_BRANCHES));
    } else {
        // Migrate branch images if they exist but use old URLs
        let branches = JSON.parse(localStorage.getItem("so_branches"));
        let updated = false;
        branches.forEach(b => {
            if (b.id === 1 && (!b.image || b.image.includes("offices/1721640105.webp"))) {
                b.image = "https://superoffice.sa/uploads/branches/image_1_1.webp";
                updated = true;
            }
            if (b.id === 4 && (!b.image || b.image.includes("offices/1721636807.webp"))) {
                b.image = "https://superoffice.sa/uploads/branches/image_1_4.webp";
                updated = true;
            }
            if (b.id === 9 && (!b.image || b.image.includes("offices/1721636653.webp"))) {
                b.image = "https://superoffice.sa/uploads/branches/image_1_9.webp";
                updated = true;
            }
        });
        if (updated) localStorage.setItem("so_branches", JSON.stringify(branches));
    }
    
    if (!localStorage.getItem("so_spaces")) {
        localStorage.setItem("so_spaces", JSON.stringify(DEFAULT_SPACES));
    } else {
        // Sync spaces images to ensure they use correct real office URLs
        let spaces = JSON.parse(localStorage.getItem("so_spaces"));
        let updated = false;
        spaces.forEach(s => {
            if (s.id === 901 && (!s.image || s.image.includes("item_1_102.webp"))) {
                s.image = "https://superoffice.sa/uploads/offices/1722154211.webp";
                updated = true;
            }
            if (s.id === 902 && (!s.image || s.image.includes("item_1_147.webp"))) {
                s.image = "https://superoffice.sa/uploads/offices/1722156725.webp";
                updated = true;
            }
        });
        if (updated) localStorage.setItem("so_spaces", JSON.stringify(spaces));
    }
    
    if (!localStorage.getItem("so_invoices")) {
        localStorage.setItem("so_invoices", JSON.stringify(DEFAULT_INVOICES));
    }
    if (!localStorage.getItem("so_bookings")) {
        localStorage.setItem("so_bookings", JSON.stringify(DEFAULT_BOOKINGS));
    }
    if (!localStorage.getItem("so_chats")) {
        localStorage.setItem("so_chats", JSON.stringify(DEFAULT_CHATS));
    }
    if (!localStorage.getItem("so_current_user")) {
        // Default mock logged in client
        const defaultUser = { name: "شركة التقنية الذكية", email: "tech@smart.com", type: "client", phone: "0500000000" };
        localStorage.setItem("so_current_user", JSON.stringify(defaultUser));
    }
}

// Data Getters and Setters
const DB = {
    getBranches: () => JSON.parse(localStorage.getItem("so_branches")),
    
    getSpaces: () => JSON.parse(localStorage.getItem("so_spaces")),
    saveSpaces: (spaces) => localStorage.setItem("so_spaces", JSON.stringify(spaces)),
    
    getInvoices: () => JSON.parse(localStorage.getItem("so_invoices")),
    saveInvoices: (invoices) => localStorage.setItem("so_invoices", JSON.stringify(invoices)),
    
    getBookings: () => JSON.parse(localStorage.getItem("so_bookings")),
    saveBookings: (bookings) => localStorage.setItem("so_bookings", JSON.stringify(bookings)),
    
    getChats: () => JSON.parse(localStorage.getItem("so_chats")),
    saveChats: (chats) => localStorage.setItem("so_chats", JSON.stringify(chats)),
    
    getCurrentUser: () => JSON.parse(localStorage.getItem("so_current_user")),
    setCurrentUser: (user) => localStorage.setItem("so_current_user", JSON.stringify(user)),
    
    // Add space (Admin)
    addSpace: (space) => {
        const spaces = DB.getSpaces();
        space.id = spaces.length > 0 ? Math.max(...spaces.map(s => s.id)) + 1 : 1000;
        space.state = 1; // 1 = available
        spaces.push(space);
        DB.saveSpaces(spaces);
        return space;
    },
    
    // Delete space (Admin)
    deleteSpace: (spaceId) => {
        let spaces = DB.getSpaces();
        spaces = spaces.filter(s => s.id !== parseInt(spaceId));
        DB.saveSpaces(spaces);
    },
    
    // Booking transaction (Done inside Client Portal)
    bookSpace: (bookingData) => {
        const bookings = DB.getBookings();
        const invoices = DB.getInvoices();
        const spaces = DB.getSpaces();
        
        const bookingId = "BK-" + Math.floor(100 + Math.random() * 900);
        const invoiceId = "INV-" + Math.floor(1000 + Math.random() * 9000);
        
        // Find selected space in database and mark it as Reserved/Occupied (state = 2)
        const space = spaces.find(s => s.id === parseInt(bookingData.spaceId));
        if (space) {
            space.state = 2; // Mark as reserved/occupied
            DB.saveSpaces(spaces);
        }
        
        const newBooking = {
            id: bookingId,
            clientName: bookingData.clientName,
            type: bookingData.spaceName,
            branch: bookingData.branchName,
            startDate: bookingData.startDate,
            endDate: bookingData.endDate,
            amount: bookingData.totalPrice,
            status: "نشط"
        };
        
        const newInvoice = {
            id: invoiceId,
            clientName: bookingData.clientName,
            type: "حجز مساحة: " + bookingData.spaceName,
            amount: bookingData.totalPrice,
            date: new Date().toISOString().split('T')[0],
            dueDate: bookingData.startDate,
            status: "unpaid"
        };
        
        bookings.push(newBooking);
        invoices.push(newInvoice);
        
        DB.saveBookings(bookings);
        DB.saveInvoices(invoices);
        
        return { bookingId, invoiceId };
    },
    
    // Pay invoice
    payInvoice: (invoiceId) => {
        const invoices = DB.getInvoices();
        const invoice = invoices.find(inv => inv.id === invoiceId);
        if (invoice) {
            invoice.status = "paid";
            DB.saveInvoices(invoices);
        }
    },
    
    // Update invoice status (Admin)
    updateInvoiceStatus: (invoiceId, status) => {
        const invoices = DB.getInvoices();
        const invoice = invoices.find(inv => inv.id === invoiceId);
        if (invoice) {
            invoice.status = status;
            DB.saveInvoices(invoices);
        }
    },
    
    // Extend active booking
    extendBooking: (bookingId, months) => {
        const bookings = DB.getBookings();
        const bookingsData = bookings.find(b => b.id === bookingId);
        if (bookingsData) {
            const end = new Date(bookingsData.endDate);
            end.setMonth(end.getMonth() + parseInt(months));
            bookingsData.endDate = end.toISOString().split('T')[0];
            bookingsData.amount += (bookingsData.amount / 3) * months;
            DB.saveBookings(bookings);
            
            // Add a new invoice for this extension
            const invoices = DB.getInvoices();
            const invId = "INV-" + Math.floor(1000 + Math.random() * 9000);
            invoices.push({
                id: invId,
                clientName: bookingsData.clientName,
                type: "تمديد عقد: " + bookingsData.type,
                amount: (bookingsData.amount / 3) * months,
                date: new Date().toISOString().split('T')[0],
                dueDate: new Date().toISOString().split('T')[0],
                status: "unpaid"
            });
            DB.saveInvoices(invoices);
        }
    },
    
    // Send chat message
    sendChatMessage: (clientEmail, text, sender = "client") => {
        const chats = DB.getChats();
        let chat = chats.find(c => c.clientEmail === clientEmail);
        
        if (!chat) {
            const user = DB.getCurrentUser();
            chat = {
                id: "chat-" + (chats.length + 1),
                clientName: user ? user.name : "عميل جديد",
                clientEmail: clientEmail,
                messages: []
            };
            chats.push(chat);
        }
        
        chat.messages.push({
            sender: sender,
            text: text,
            time: new Date().toISOString()
        });
        
        DB.saveChats(chats);
        return chat;
    }
};

// Initial Call
initDB();
