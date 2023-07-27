const Disease = require("../models/disease")

exports.createDisease  = (req,res) =>{

    
    let disease = new Disease ({
        name:req.body.name,
        description:req.body.description,
        synonyms:req.body.synonyms,
        symptoms:req.body.symptoms,
        causes:req.body.causes,
    })

    disease.save().then(() => {
        res.json({
            message: "Disease created sucessfully"
        })
    })
}