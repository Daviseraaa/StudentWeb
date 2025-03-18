const studentService =require("../services/StudentService");
const StudentSchema = require("../models/Student.js");
const StudentModel = require("../models/Student");


exports.getAllStudents = async (req, res) => {
    try{
        const students = await studentService.getAllStudents();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({data: students, status: "success"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

exports.createStudent = async (req, res) =>{
    try{
        const student = await studentService.createStudent(req.body);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({data: student, status: "success"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

exports.getStudentById = async (req, res) =>{
    try{
        const student = await studentService.getStudentById(req.params.id);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({data: student, status: "success"});
    }catch(err){
        res.status(500).json({error: err.message});
    }
};
exports.updateStudent = async (req, res) =>{
    try{

        const student = await studentService.updateStudent(req.params.id, req.body);
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (student == null) {
            res.status(404).json({ message : `Không tìm thấy sinh viên có mã id ${req.params.id}`, status: "error"});
        } else {
        res.json({data: student, status: "success"});
        }
    }catch(err){
        res.status(500).json({error: `id sinh viên không hợp lệ`});
    }
};
exports.deleteStudent = async (req, res) =>{
    try{
        const student = await studentService.deleteStudent(req.params.id, req.body);
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (student == null) {
            res.status(404).json({ message : `Không tìm thấy sinh viên có mã id ${req.params.id}`, status: "error"});
        } else {
        res.json({data: student, status: "success"});
        }
    }catch(err){
        res.status(500).json({error: `id sinh viên không hợp lệ`});
    }
};
exports.searchStudent = async (req, res) => {
    try {
        var {name, address}=req.query;
        const removeVietnameseDiacritics = (str) => {
            return str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D");
        };

        if (name == undefined) {name = ""};
        if (address == undefined) {address = ""};
        console.log(address)

        const students = await StudentModel.find({ name: {$regex: '.*' + name + '.*', $options: 'i'}, address: {$regex: '.*' + address + '.*', $options: 'i'}});
        const students1 = await StudentModel.find({ name: {$regex: '.*' + removeVietnameseDiacritics(name) + '.*', $options: 'i'}, address: {$regex: '.*' + removeVietnameseDiacritics(address) + '.*', $options: 'i'}});
        const newStudent = students.concat(students1);
        res.json({data: newStudent, status: "success"});
    }
    catch(err){
        res.status(500).json({error:"Lỗi trong khi tìm sinh viên"})
    }
};