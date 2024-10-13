export async function getreq(req, res) {
    const {id} = req.params;
    console.log("id here" + id)
    res.status(200).json({message : "got req"})
}

export async function postreq(req, res) {
    const {username, password} = req.body
    console.log("username :" +  username)
    console.log("password :" +  password)
    res.status(200).json({message : "got post req"})
}