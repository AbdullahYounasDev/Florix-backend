import axios from "axios";
import { ErrorCodes } from "../utils/constants.js";
import { error } from "../utils/response.js";


export const getPestDiseaseList = async (req, res) => {
    const PERENUAL_API_KEY = process.env.PERENUAL_API_KEY;
    console.log(PERENUAL_API_KEY)
    const { cropName } = req.body;
    console.log(cropName)

    if (!cropName || cropName.trim() === "") {
        return error(res, ErrorCodes.CROP_NAME_REQUIRED, 400);
    }

    const response = await axios.get(`https://perenual.com/api/pest-disease-list`, {
        params: {
            key: PERENUAL_API_KEY,
            q: cropName
        }
    });
    console.log(response)

    const apiResponse = response.data.data;

    const filteredResults = apiResponse.filter(item => {
        // We check if any host name matches the cropName
        return item.host.some(hostName => 
            hostName.toLowerCase().includes(cropName.toLowerCase())
        );
    });

    // Filter logic to separate the two for your UI
    const diseases = filteredResults.filter(item => {
        const name = item.common_name.toLowerCase();
        const desc = JSON.stringify(item.description).toLowerCase();
        // Look for keywords that identify it as a disease
        return name.includes('wilt') || name.includes('gall') || name.includes('mildew') || desc.includes('fungus') || desc.includes('bacterium');
    });

    const pests = filteredResults.filter(item => {
        const name = item.common_name.toLowerCase();
        const desc = JSON.stringify(item.description).toLowerCase();
        // Look for keywords that identify it as a pest/insect
        return name.includes('borer') || name.includes('aphid') || name.includes('mite') || desc.includes('insect') || desc.includes('larvae');
    });

    res.json({
        success: true,
        diseases: diseases, // Default selected in your app
        pests: pests        // Show when user clicks Pests toggle
    });
}