const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend folder
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

console.log(`📁 Serving frontend from: ${frontendPath}`);

// ============= DATABASE CONNECTION =============
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'mut_ict_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

// ============= OPENROUTER AI SETUP (FREE) =============
const openrouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3001',
        'X-Title': 'MUT ICT Department Assistant'
    }
});

// ✅ Read model from .env, fallback to a reliable free model
const AI_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';

let aiAvailable = false;
if (process.env.OPENROUTER_API_KEY) {
    console.log('🤖 OpenRouter AI: ENABLED (Free models available)');
    console.log(`   Using model: ${AI_MODEL}`);
    aiAvailable = true;
} else {
    console.log('⚠️ OpenRouter AI: DISABLED - No API key found');
}

// ============= REST API ENDPOINTS =============

app.get('/api/hello', (req, res) => {
    res.json({ 
        message: 'MUT ICT Server Running!',
        status: 'success',
        timestamp: new Date(),
        endpoints: [
            'GET  /api/hello',
            'GET  /api/info', 
            'GET  /api/search?q=query',
            'POST /api/chat',
            'GET  /api/user/:role',
            'POST /api/register',
            'POST /api/login',
            'POST /api/contact',
            'POST /api/tour-booking',
            'PUT  /api/student/:id',
            'DELETE /api/booking/:id',
            'DELETE /api/message/:id',
            'GET  /api/students',
            'GET  /api/student/:id'
        ]
    });
});

app.get('/api/info', (req, res) => {
    res.json({
        name: 'MUT ICT Department API',
        version: '1.0.0',
        server: 'Express.js',
        database: 'MySQL connected ✅',
        frontend: frontendPath,
        status: 'running ✅'
    });
});

app.get('/api/search', (req, res) => {
    const query = req.query.q || '';
    
    const searchableContent = [
        { title: 'Diploma in ICT', description: '3-year NQF Level 6 programme with 6-month industry internship', url: 'courses.html', type: 'programme' },
        { title: 'Extended Curriculum Programme', description: '4-year pathway with foundation year', url: 'courses.html', type: 'programme' },
        { title: 'Advanced Diploma in ICT', description: '1-year NQF Level 7 postgraduate specialisation', url: 'courses.html', type: 'programme' },
        { title: 'Admission Requirements', description: 'NSC with 50% Maths or 60% Maths Lit, 50% English', url: 'admissions.html', type: 'admission' },
        { title: 'How to Apply', description: 'Apply through CAO at cao.ac.za', url: 'admissions.html', type: 'admission' },
        { title: 'Campus Location', description: 'Building 10, MUT, Umlazi, Durban', url: 'contact.html', type: 'contact' },
        { title: 'Contact Information', description: 'Email: ict@mut.ac.za | Phone: +27 31 123 4567', url: 'contact.html', type: 'contact' }
    ];
    
    if (query.length === 0) {
        return res.json({ results: [], count: 0 });
    }
    
    const results = searchableContent.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({ query: query, results: results, count: results.length });
});

// ============= AI-POWERED CHATBOT (Using OpenRouter - FREE) =============
app.post('/api/chat', async (req, res) => {
    const { message, student_id } = req.body;
    
    console.log(`📨 Chat request: "${message}"`);
    
    if (!message || message.trim() === '') {
        return res.json({ 
            answer: "Please ask me a question about MUT ICT Department! 😊",
            suggestions: ['What programmes do you offer?', 'Admission requirements', 'How to apply?']
        });
    }
    
    const systemPrompt = `You are the friendly, helpful MUT ICT Department Assistant for Mangosuthu University of Technology in Umlazi, Durban, South Africa.

IMPORTANT INFORMATION ABOUT MUT ICT:

PROGRAMMES:
- Diploma in ICT: 3 years, NQF Level 6, R45,000/year. Includes 6-month internship.
- Extended Curriculum Programme: 4 years (Foundation year + 3 years), NQF Level 5-6, R40,000/year.
- Advanced Diploma in ICT: 1 year, NQF Level 7, R55,000/year.

ADMISSION REQUIREMENTS:
- Diploma: NSC with diploma admission, 50% Maths OR 60% Maths Lit, 50% English.
- Extended: NSC, 40% Maths OR 50% Maths Lit, 40% English.
- Advanced: Diploma in ICT with 60% average, motivation letter.

HOW TO APPLY:
- Apply through CAO at cao.ac.za
- Deadlines: 31 July (February intake), 30 November (July intake)

LOCATION:
- Address: Building 10, MUT Campus, Umlazi, Durban

CAMPUS TOURS:
- Monday-Friday, 09:00-15:00, Duration: 1.5-2 hours

RULES:
1. Be friendly and helpful. Use emojis occasionally 😊
2. Keep answers concise (2-3 short paragraphs)
3. Always end with a question or suggestion`;

    try {
        let aiReply = "";
        let aiUsed = false;
        
        if (aiAvailable) {
            console.log(`🤖 Calling OpenRouter AI (${AI_MODEL})...`);
            
            const completion = await openrouter.chat.completions.create({
                model: AI_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 500,
                temperature: 0.7
            });
            
            aiReply = completion.choices[0].message.content;
            console.log('✅ OpenRouter AI response received');
            aiUsed = true;
        } else {
            aiReply = getHardcodedResponse(message);
            console.log('⚠️ Using hardcoded response (no AI)');
        }
        
        let suggestions = [];
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('programme') || lowerMsg.includes('course')) {
            suggestions = ['Tell me about Diploma', 'Extended programme details', 'Advanced Diploma requirements'];
        } else if (lowerMsg.includes('admission') || lowerMsg.includes('require')) {
            suggestions = ['How to apply?', 'Application deadlines', 'Required documents'];
        } else if (lowerMsg.includes('fee') || lowerMsg.includes('cost')) {
            suggestions = ['NSFAS information', 'Other bursaries', 'Payment plans'];
        } else if (lowerMsg.includes('location') || lowerMsg.includes('address')) {
            suggestions = ['Schedule a tour', 'Public transport', 'Parking information'];
        } else if (lowerMsg.includes('career') || lowerMsg.includes('job')) {
            suggestions = ['Internship program', 'Salary ranges', 'Industry partners'];
        } else {
            suggestions = ['Programmes', 'Admission requirements', 'How to apply', 'Location', 'Careers', 'Fees'];
        }
        
        res.json({ 
            question: message, 
            answer: aiReply,
            suggestions: suggestions,
            timestamp: new Date(),
            ai_generated: aiUsed
        });
        
    } catch (error) {
        console.error('❌ AI error:', error.message);
        
        console.error(`   Failed model: ${AI_MODEL}`);
        console.error(`   Tip: Update OPENROUTER_MODEL in .env with a valid free model`);
        
        res.json({ 
            question: message, 
            answer: getHardcodedResponse(message),
            suggestions: ['Programmes', 'Admission requirements', 'How to apply', 'Location', 'Careers', 'Fees'],
            timestamp: new Date(),
            ai_generated: false
        });
    }
});

function getHardcodedResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('programme') || lowerMsg.includes('courses')) {
        return "🎓 **MUT ICT Programmes:**\n\n• **Diploma in ICT** (3 years) - R45,000/year\n• **Extended Curriculum** (4 years) - R40,000/year\n• **Advanced Diploma** (1 year) - R55,000/year\n\nWhich programme interests you? 😊";
    }
    else if (lowerMsg.includes('admission') || lowerMsg.includes('require')) {
        return "📋 **Admission Requirements:**\n\n**Diploma:** 50% Maths or 60% Maths Lit, 50% English\n**Extended:** 40% Maths or 50% Maths Lit, 40% English\n**Advanced:** Diploma in ICT with 60% average\n\nApply through CAO: cao.ac.za";
    }
    else if (lowerMsg.includes('fee') || lowerMsg.includes('cost')) {
        return "💰 **Tuition Fees:**\n\n• Diploma: R45,000/year\n• Extended: R40,000/year\n• Advanced: R55,000/year\n\nNSFAS funding available!";
    }
    else if (lowerMsg.includes('location') || lowerMsg.includes('address')) {
        return "📍 **MUT Campus:** Building 10, Umlazi, Durban.\n\nWould you like to schedule a campus tour?";
    }
    else if (lowerMsg.includes('career') || lowerMsg.includes('job')) {
        return "💼 **Career Opportunities:** Software Developer, Network Engineer, Cybersecurity Analyst.\n\n• 95%+ employment rate\n• Starting salary: R250k-R350k/year";
    }
    else if (lowerMsg.includes('tour') || lowerMsg.includes('visit')) {
        return "🏫 **Campus Tours:** Monday-Friday, 09:00-15:00.\n\nClick the 'Schedule a Campus Tour' button to book!";
    }
    else if (lowerMsg.includes('nsfas') || lowerMsg.includes('bursary')) {
        return "💰 **NSFAS:** Available for eligible students. Apply at nsfas.org.za by 30 November.";
    }
    else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        return "👋 **Hello! Welcome to MUT ICT Assistant!**\n\nI can help you with programmes, admissions, fees, location, and careers.\n\nWhat would you like to know? 😊";
    }
    else {
        return "🤖 **I'm the MUT ICT Department Assistant!**\n\nI can help you with:\n\n• 📚 Programmes and courses\n• 📋 Admission requirements\n• 💰 Tuition fees and NSFAS\n• 📍 Campus location and tours\n• 💼 Career opportunities\n\nWhat would you like to know? 😊";
    }
}

app.get('/api/user/:role', (req, res) => {
    const role = req.params.role;
    const dashboards = {
        visitor: { title: 'Welcome to MUT ICT', role: 'visitor', menu: ['Home', 'About', 'Programmes', 'Admissions', 'Contact'] },
        student: { title: 'Student Dashboard', role: 'student', menu: ['LMS Portal', 'Student Portal', 'Timetable', 'Downloads'] }
    };
    res.json(dashboards[role] || dashboards.visitor);
});

// ============= STUDENT REGISTRATION =============
app.post('/api/register', async (req, res) => {
    const { student_number, first_name, last_name, email, phone, course, year_level, password } = req.body;
    
    const checkQuery = 'SELECT id FROM Students WHERE student_number = ? OR email = ?';
    db.query(checkQuery, [student_number, email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Student number or email already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const insertQuery = `INSERT INTO Students (student_number, first_name, last_name, email, phone, course, year_level, password_hash) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        db.query(insertQuery, [student_number, first_name, last_name, email, phone, course, year_level, hashedPassword], (err, result) => {
            if (err) {
                console.error('Insert error:', err);
                return res.status(500).json({ error: 'Registration failed' });
            }
            console.log(`✅ New student registered: ${first_name} ${last_name} (${student_number})`);
            res.json({ success: true, id: result.insertId, message: 'Registration successful!' });
        });
    });
});

// ============= STUDENT LOGIN =============
app.post('/api/login', (req, res) => {
    const { student_number, password } = req.body;
    
    const query = 'SELECT * FROM Students WHERE student_number = ?';
    db.query(query, [student_number], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid student number or password' });
        }
        
        const student = results[0];
        const validPassword = await bcrypt.compare(password, student.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid student number or password' });
        }
        
        res.json({
            success: true,
            student: {
                id: student.id,
                student_number: student.student_number,
                first_name: student.first_name,
                last_name: student.last_name,
                email: student.email,
                phone: student.phone,
                course: student.course,
                year_level: student.year_level
            }
        });
    });
});

// ============= CONTACT FORM =============
app.post('/api/contact', (req, res) => {
    const { first_name, last_name, email, phone, subject, message, student_id } = req.body;
    
    const query = `INSERT INTO ContactMessages (first_name, last_name, email, phone, subject, message, student_id) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [first_name, last_name, email, phone, subject, message, student_id || null], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to save message' });
        }
        console.log(`📝 Contact message saved from ${first_name} ${last_name}`);
        res.json({ success: true, id: result.insertId });
    });
});

// ============= TOUR BOOKING =============
app.post('/api/tour-booking', (req, res) => {
    const { first_name, last_name, email, phone, tour_date, visitors, special_requests, student_id } = req.body;
    
    const query = `INSERT INTO TourBookings (first_name, last_name, email, phone, tour_date, visitors, special_requests, student_id) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [first_name, last_name, email, phone, tour_date, visitors, special_requests, student_id || null], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to save booking' });
        }
        console.log(`📅 Tour booking saved for ${first_name} ${last_name}`);
        res.json({ success: true, id: result.insertId });
    });
});

// ============= CRUD OPERATIONS (PUT & DELETE) =============

// GET all students (VIEW)
app.get('/api/students', (req, res) => {
    console.log('📊 GET /api/students - Fetching all students');
    db.query('SELECT id, student_number, first_name, last_name, email, phone, course, year_level FROM Students', (err, results) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log(`✅ Found ${results.length} students`);
        res.json(results);
    });
});

// GET single student
app.get('/api/student/:id', (req, res) => {
    const studentId = req.params.id;
    console.log(`📊 GET /api/student/${studentId}`);
    db.query('SELECT id, student_number, first_name, last_name, email, phone, course, year_level FROM Students WHERE id = ?', [studentId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Student not found' });
        res.json(results[0]);
    });
});

// UPDATE Student Profile (PUT)
app.put('/api/student/:id', (req, res) => {
    const { first_name, last_name, phone, course, year_level } = req.body;
    const studentId = req.params.id;
    
    console.log(`📝 PUT /api/student/${studentId} - Updating student`);
    console.log(`   Data:`, { first_name, last_name, phone, course, year_level });
    
    const query = `UPDATE Students SET first_name = ?, last_name = ?, phone = ?, course = ?, year_level = ? WHERE id = ?`;
    
    db.query(query, [first_name, last_name, phone, course, year_level, studentId], (err, result) => {
        if (err) {
            console.error('❌ Update error:', err);
            return res.status(500).json({ error: 'Failed to update student' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        console.log(`✅ Student ${studentId} updated successfully`);
        res.json({ success: true, message: 'Student profile updated' });
    });
});

// DELETE Booking (DELETE)
app.delete('/api/booking/:id', (req, res) => {
    const bookingId = req.params.id;
    console.log(`🗑️ DELETE /api/booking/${bookingId} - Cancelling booking`);
    
    db.query('DELETE FROM TourBookings WHERE id = ?', [bookingId], (err, result) => {
        if (err) {
            console.error('❌ Delete error:', err);
            return res.status(500).json({ error: 'Failed to delete booking' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        console.log(`✅ Booking ${bookingId} deleted successfully`);
        res.json({ success: true, message: 'Booking cancelled/deleted' });
    });
});

// DELETE Message (DELETE)
app.delete('/api/message/:id', (req, res) => {
    const messageId = req.params.id;
    console.log(`🗑️ DELETE /api/message/${messageId} - Deleting message`);
    
    db.query('DELETE FROM ContactMessages WHERE id = ?', [messageId], (err, result) => {
        if (err) {
            console.error('❌ Delete error:', err);
            return res.status(500).json({ error: 'Failed to delete message' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        
        console.log(`✅ Message ${messageId} deleted successfully`);
        res.json({ success: true, message: 'Message deleted successfully' });
    });
});

// ============= SERVE HTML PAGES =============
app.get('/', (req, res) => { res.sendFile(path.join(frontendPath, 'index.html')); });
app.get('/index.html', (req, res) => { res.sendFile(path.join(frontendPath, 'index.html')); });
app.get('/about.html', (req, res) => { res.sendFile(path.join(frontendPath, 'about.html')); });
app.get('/courses.html', (req, res) => { res.sendFile(path.join(frontendPath, 'courses.html')); });
app.get('/admissions.html', (req, res) => { res.sendFile(path.join(frontendPath, 'admissions.html')); });
app.get('/contact.html', (req, res) => { res.sendFile(path.join(frontendPath, 'contact.html')); });
app.get('/search.html', (req, res) => { res.sendFile(path.join(frontendPath, 'search.html')); });
app.get('/styles.css', (req, res) => { res.sendFile(path.join(frontendPath, 'styles.css')); });
app.get('/script.js', (req, res) => { res.sendFile(path.join(frontendPath, 'script.js')); });

app.get('/*path', (req, res) => {
    const filePath = path.join(frontendPath, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.sendFile(filePath);
    } else {
        res.sendFile(path.join(frontendPath, 'index.html'));
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Open: http://localhost:${PORT}/index.html`);
    if (process.env.OPENROUTER_API_KEY) {
        console.log(`🤖 AI Chatbot: ENABLED (OpenRouter - Free models)`);
        console.log(`   Using model: ${AI_MODEL}`);
    } else {
        console.log(`⚠️ AI Chatbot: DISABLED - Add OPENROUTER_API_KEY to .env`);
    }
    console.log(`\n📋 CRUD Endpoints:`);
    console.log(`   - GET  /api/students (View all students)`);
    console.log(`   - GET  /api/student/:id (View single student)`);
    console.log(`   - PUT  /api/student/:id (Update student)`);
    console.log(`   - DELETE /api/booking/:id (Cancel booking)`);
    console.log(`   - DELETE /api/message/:id (Delete message)`);
    console.log(`=============================================\n`);
});