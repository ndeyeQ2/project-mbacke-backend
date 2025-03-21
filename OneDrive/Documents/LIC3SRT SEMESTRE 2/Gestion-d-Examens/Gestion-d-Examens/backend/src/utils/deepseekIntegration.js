const axios = require('axios');

const correctExam = async (examText, studentResponse) => {
    const response = await axios.post('http://localhost:8000/api/deepseek/correct', {
        examText,
        studentResponse
    });
    return response.data;
};

module.exports = { correctExam };