const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken');


const librarySchema= new mongoose.Schema({
    name:{
        type:String,
        minlenght:3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validator(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid username or password");
            }
        }
    },
    phone:{
     type:Number,
     min:10,
    },
    password:{
        type:String,
        required:true,
    },
    confirmpassword:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]

})

librarySchema.methods.genrateAuthToken= async function(){
  try{
       const token=jwt.sign({ _id: this._id.toString() }, "iamabadboyandsheisgoodgorlandshenameisxyvjhdkdhka")
       this.tokens=this.tokens.concat({token:token});
        await   this.save();
        return token;
  }catch(err)
  {
    res.send("The error part "+err);
  }
}

librarySchema.pre("save",async function(next){
     if(this.isModified("password"))
     {
        this.password=await bcrypt.hash(this.password,10);
     this.confirmpassword=await bcrypt.hash(this.password,10);
     }
     next();
    
})



const Library=mongoose.model("Library",librarySchema);
module.exports=Library;