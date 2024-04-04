import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Student } from "../models/student.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Teacher} from "../models/teacher.model.js"
import { Assignment } from "../models/assignment.model.js";
import { Solution } from "../models/solution.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const giveAssignment = asyncHandler(async(req,res)=>{
    const {title , description , className,subject,teacherName,guidelines,deadline} = req.body;
    console.log(title)
    if (
    [title, description, className, subject,teacherName,guidelines,deadline].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const assignment = await Assignment.create({
    title,
    description,
    teacherName,
    subject:subject.toLowerCase(),
    className,
    guidelines,
    deadline

  })
  const createdAssignment = await Assignment.findById(assignment._id)

  if (!createdAssignment) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
    return res
    .status(201)
    .json(new ApiResponse(200, createdAssignment, "Assignment created Successfully"));

});

const getAssignments = asyncHandler(async (req,res)=>{
  try {
    const assignments = await Assignment.find();
    if(!assignments){
      throw new ApiError(400,"error while fetching Assignments")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,assignments,"Assignments fetch successfully"))
  } catch (error) {
    throw new ApiError(400 , `Can't fetch assignment from mongodb ${error}`)
  }
})

const solutionAssignment = asyncHandler(async (req, res) => {
  try {
    const { assignmentId } = req.params; // Assuming assignmentId is passed in the request parameters
   const pptLocalPath = req.files?.pptUrl[0]?.path;
if (!pptLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const pptUrl = await uploadOnCloudinary(pptLocalPath)

  const videoLocalPath = req.files?.videoUrl[0]?.path;
if (!videoLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const videoUrl = await uploadOnCloudinary(videoLocalPath)

    const solution = new Solution({
      assignment: assignmentId,
      pptUrl: pptUrl,
      videoUrl: videoUrl,
    });

    await solution.save();

    res.status(201).json({ success: true, data: solution });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


export {
    giveAssignment,
    getAssignments,
    solutionAssignment
}