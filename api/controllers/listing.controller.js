const Listing = require('../models/listing.model')

module.exports.createListing = async (req, res) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(200).json({ success: true, message: "Listing Created Sucessfully!", listing });
    } catch (error) {
        console.log("error in creating listing", error)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}