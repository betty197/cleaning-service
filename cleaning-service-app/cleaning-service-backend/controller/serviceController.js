const {
    getAllServices,
    getServiceById: getServiceByIdModel,
    createService: createServiceModel,
    updateService: updateServiceModel,
    deleteService: deleteServiceModel,
} = require("../models/Service");

// Get all services
const getServices = async (req, res) => {
    try {
        const services = await getAllServices();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get service by ID
const getServiceById = async (req, res) => {
    try {
        const service = await getServiceByIdModel(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new service
const createService = async (req, res) => {
    try {
        const id = await createServiceModel(req.body);
        res.status(201).json({ id, message: "Service created" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update service
const updateService = async (req, res) => {
    try {
        await updateServiceModel(req.params.id, req.body);
        res.json({ message: "Service updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete service
const deleteService = async (req, res) => {
    try {
        await deleteServiceModel(req.params.id);
        res.json({ message: "Service deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
};
