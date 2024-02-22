import {ClarifaiStub, grpc} from "clarifai-nodejs-grpc";

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 8d9a5c5e03f24933a37e29e2f78faafe");

const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            model_id: "face-detection",
            inputs: [{data: {image: {url: req.body.input}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }

            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }

            console.log("Predicted concepts, with confidence values:")
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
            res.json(response)
        }
    );
}

// const returnClarifaiRequestOptions = (imgUrl) => {
//     // Your PAT (Personal Access Token) can be found in the portal under Authentification
//     const PAT = 'ac7f679b03684cf4bfe9d48abb88a320';
//     // Specify the correct user_id/app_id pairings
//     // Since you're making inferences outside your app's scope
//     const USER_ID = 'ottttoooo';
//     const APP_ID = 'test';
//     // Change these to whatever model and image URL you want to use
//     // const MODEL_ID = 'face-detection';
//     const IMAGE_URL = imgUrl;
//     // To use image bytes, assign its variable   
//      const raw = JSON.stringify({
//         "user_app_id": {
//             "user_id": USER_ID,
//             "app_id": APP_ID
//         },
//         "inputs": [
//             {
//                 "data": {
//                     "image": {
//                         "url": IMAGE_URL
//                         // "base64": IMAGE_BYTES_STRING
//                     }
//                 }
//             }
//         ]
//     });
    
//     const requestOptions = {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Authorization': 'Key ' + PAT
//         },
//         body: raw
//     }; 
  
//     return requestOptions;
// }


    // fetch("https://api.clarifai.com/v2/models/" 
    //     + 'face-detection' 
    //     + "/outputs", 
    //     returnClarifaiRequestOptions(req.body.input)
    //     )
    // .then(response => response.json())
    // .then(data => {
    //     res.json(data);
    // })
    // .catch(err => res.status(400).json('unable to work with API'));




const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

export default {handleImage, handleApiCall};