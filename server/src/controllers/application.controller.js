const Application = require('../models/Application.model');

// Helper to generate application number
const generateAppNumber = () => `HCL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

exports.submitApplication = async (req, res) => {
    try {
        const appData = {
            ...req.body,
            applicationNumber: generateAppNumber(),
            history: [{
                date: new Date().toISOString().split('T')[0],
                action: 'Application Submitted',
                actor: 'System'
            }]
        };

        const application = await Application.create(appData);
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.checkPrevious = async (req, res) => {
    try {
        const { pan } = req.query;
        if (!pan) return res.status(400).json({ message: 'PAN is required' });

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentApp = await Application.findOne({
            pan: pan.toUpperCase(),
            createdAt: { $gte: sixMonthsAgo }
        }).sort({ createdAt: -1 });

        res.json({
            exists: !!recentApp,
            application: recentApp
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStatus = async (req, res) => {
    try {
        const { applicationNumber } = req.query;
        const application = await Application.findOne({ applicationNumber });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getApplications = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) query.finalStatus = status;
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { applicationNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;
        const total = await Application.countDocuments(query);
        const applications = await Application.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            items: applications,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { updates, logEntry } = req.body;

        const application = await Application.findById(id);
        if (!application) return res.status(404).json({ message: 'Not found' });

        Object.assign(application, updates);

        if (logEntry) {
            application.history.push({
                date: new Date().toISOString().split('T')[0],
                ...logEntry
            });
        }

        await application.save();
        res.json(application);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
