
// @desc    Get All BootCamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootCamps= (req,res,next)=>{

    res.status(200).json({
        success:true,
        message:'Show all bootcamps',
        data:{
           
        }
    });
    next();
}


// @desc    Get a Single BootCamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootCamp= (req,res,next)=>{
     //  req.params.id - to get the value of id
    res.status(200).json({
        success:true,
        message:`Display a single bootcamps ${req.params.id}`,
        data:{
           
        }
    });
    next();
}

// @desc    Create a new BootCamp
// @route   POST /api/v1/bootcamps/
// @access  Private
exports.createBootCamp= (req,res,next)=>{
    //  req.params.id - to get the value of id
    res.status(200).json({
        success:true,
        message:'Create New bootcamps',
        data:{

        }
    });
    next();
}

// @desc    Update BootCamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootCamp= (req,res,next)=>{
    //  req.params.id - to get the value of id
    res.status(200).json({
        success:true,
        message:`Update bootcamps ${req.params.id}`,
        data:{

        }
    });
    next();
}

// @desc    Delete BootCamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootCamp= (req,res,next)=>{
    //  req.params.id - to get the value of id
    res.status(200).json({
        success:true,
        message:`Delete bootcamp with ID: ${req.params.id}`,
        data:{

        }
    });
    next();
}
