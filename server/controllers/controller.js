import User from "../Models/usermodel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mcqlistmodel from "../Models/mcqlistmodel.js";
import mongoose from 'mongoose';
import mcq from '../Models/mcqmodel.js'

export async function getquestions(req, res){
    res.send("get request for questions");
}

export async function postquestions(req, res){
    const id = req.params.id;
    res.send(`request send with id : ${id}`);
}


export async function handlelogin(req, res){
  try{
    const {username, password} = req.body;
    
    const user = await User.findOne({username})

    if(!user){
      return res.status(401).json({message : 'invalid username or password'})
    }
    
    const vaildpass = await bcrypt.compare(password, user.password) 

    if(!vaildpass){
      return res.status(401).json({message : 'invalid username or password'})
    }

    const token = jwt.sign(
      {userId : user._id, username : user.username},
      "secret",
      {expiresIn : '5h'}
    )

    res.status(200).json({
      message:'Login successful',
      token,
      user : {
        id : user._id,
        username : user.username,
        email: user.email
      }
    })
  } 
  catch(error){
    console.log("login error:", error);
    return res.status(500).json({message : "error during login"})
  }
}


export async function handlesignup(req, res){
    try {
        const { username, email, password } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        
        // console.log("existing user:", existingUser)
        // console.log("username:", username)

        if (existingUser) {
          return res.status(400).json({ message: 'Username or email already exists' });
        }
      
        // If user doesn't exist, proceed with user creation...
        // ... (hashing password, saving user, creating token, etc.)

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
    
        // Save user to database
        await newUser.save();
//process.env.JWT_SECRET
        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username },
            "secretkey",
            { expiresIn: '5h' }
          );
      
          // Send response
          res.status(201).json({ 
            message: 'User created successfully', 
            token,
            user: {
              id: newUser._id,
              username: newUser.username,
              email: newUser.email
            }
          });

    
      } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup' });
      }
    // res.send("ok working path")
}

export const getmcqlists = async (req, res) => {
  try {
    const userId = req.user._id;
    const mcqlists = await mcqlistmodel.find({ user: userId });
    res.json(mcqlists);
  } catch (error) {
    console.error('Error in getmcqlists:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export async function addmcqlists(req, res){
  try{
    const {name, description} = req.body;
    const mcqlist = new mcqlistmodel({
      name,
      description,
      user: req.user._id,
    })
    const savedmcqlist = await mcqlist.save();
    res.status(201).json(savedmcqlist)
  }
  catch(error){
    console.error("error in addmcqlists", error);
    res.status(500).json({message : "error adding mcqlists"})
  }
}

export async function deletemcqlist(req, res){
  try{
    const {id} = req.params;
    const mcqlist = await mcqlistmodel.findOneAndDelete({_id : id, user : req.user._id})
    if(!mcqlist){
      res.status(404).json({message : "Cannot deletemcqlist or invalid id or requested resource doesnt exist"})
    }
    res.status(200).json({ message: "MCQ list deleted successfully" });
  }
  catch(error){
    console.error("error in deletemcqlist", error)
    res.status(500).json({message: "error deleting mcqlist"})
  }
}

export async function getmcq(req, res){
  try{
    
    const mcqlist = await mcqlistmodel.findById(req.params.id);
   
    if(!mcqlist){
      res.status(404).json({message : "mcqlist not found for mcq"})
    }
    if(mcqlist.user.toString() !== req.user._id.toString()){
      res.status(401).json({message: "you are not authorized"})
    }
    const mcqs = await mcq.find({list : req.params.id})
    res.status(201).json(mcqs);
  }
  catch(error){
    console.error('error in getmcq:', error);
    res.status(500).json({message : "error in getmcq"})
  }
}

export async function addmcq(req, res){
  try{
    const {question, options, correctAnswer} = req.body;
    const {id} = req.params;
    const mcqlist = await mcqlistmodel.findById(id);
    if(!mcqlist){
      res.status(404).json({message : "mcqlist not found"});
    }
    if(mcqlist.user.toString() !== req.user._id.toString()){
      res.status(403).json({message : "you are not authorized to add mcq"})
    }
    const newmcq = new mcq({
      question,
      options,
      correctAnswer,
      list : id
    })
    const savedmcq = await newmcq.save();
    res.status(200).json(savedmcq)
  } 
  catch(error){
    console.error('error in addmcq:', error);
    res.status(500).json({message : "error in addmcq"})
  }
}

export async function deletemcq(req, res){
  try{
    const {id, mcqid} = req.params;
    const mcqlist = await mcqlistmodel.findById(id);
    
    if(!mcqlist){
      return res.status(404).json({message : 'mcqlist(resource) not found'})
    }
    if(mcqlist.user.toString() !== req.user._id.toString()){
      return res.status(403).json({message : 'you are not authorized to delete'})
    }
    const currmcq = mcq.findById(mcqid)
    if(!currmcq){
      return res.status(404).json({message : 'mcq(resource) not found'})
    }
    await mcq.findByIdAndDelete(mcqid);
    res.status(201).json({message : 'mcq deleted'})
  }
  catch(error){
    console.error('error in deletemcq:', error);
    res.status(500).json({message : 'error in deletemcq'})
  }
}

export async function updatemcq(req, res){
  const {id, mcqid} = req.params;
  try{
    const mcqlist = await mcqlistmodel.findById(id);
    if(!mcqlist){
      return res.status(404).json({message : "mcqlist not found"});
    }
    if(mcqlist.user.toString() !== req.user._id.toString()){
      return res.status(403).json({message : "you are not authorized to update"})
    }
    const currmcq = await mcq.findById(mcqid)
    if(!currmcq){
      return res.status(404).json({message : "mcq is not found"})
    }
    const {question, options, correctAnswer} = req.body;
    currmcq.question = question;
    currmcq.options = options;
    currmcq.correctAnswer = correctAnswer;
    const updatedmcq = await currmcq.save();
    res.status(200).json(updatedmcq)
  }
  catch(error){
    console.error('error in deletemcq:', error);
    res.status(500).json({message : 'server error in deletemcq'})
  }
}

export async function getsomething(req, res){
    res.send("working")
}
