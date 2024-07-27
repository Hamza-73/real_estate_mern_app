const Listing = require('../models/listing.model')
const User = require('../models/user.model')

module.exports.createListing = async (req, res) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(200).json({ success: true, message: "Listing Created Sucessfully!", listing });
    } catch (error) {
        console.log("error in creating listing", error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports.deleteListing = async (req, res) => {
    try {
        const checkListing = await Listing.findById(req.params.id);
        if (!checkListing) return res.status(404).json({ success: false, message: "Listing" });

        if (req.user.id !== checkListing.userRef) {
            return res.status(500).json({ success: false, message: "You can only delete your won listing" })
        }
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: "Listing deleted successfully!" })
    } catch (error) {
        console.log("error in deleting listing")
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

module.exports.updateListings = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" })
        }
        if (req.user.id !== listing.userRef) {
            return res.status(500).json({ success: false, message: "You can only update your own listing" })
        }
        const updateListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ success: true, message: "Listing updated successfully!", updateListing })
    } catch (error) {
        console.log("error in updating listing", error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

module.exports.getListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" })
        }
        return res.status(200).json({ success: true, message: "Listing found successfully!", listing })

    } catch (error) {
        console.log("error in getting listing", error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

module.exports.getListings = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if (offer === undefined || offer === false) {
            offer = { $in: [false, true] }
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === false) {
            furnished = { $in: [false, true] }
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === false) {
            parking = { $in: [false, true] }
        }

        let type = req.query.type;
        if (type === undefined || type === false) {
            type = { $in: ['sale', 'rent'] }
        }

        const searchTerm = req.query.searchTerm || "";

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        }).sort(
            {[sort]: order}
        ).limit(limit).skip(startIndex);
        return res.status(200).json({ success: true, message: "Listings fetched successfully!", listings })
    } catch (error) {
        console.log("error in getting listing", error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}