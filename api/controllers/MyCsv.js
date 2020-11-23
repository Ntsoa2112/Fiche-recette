// Constructor
   function Student(name, age, id)
    {
        // always initialize all instance properties
        this.name = name;
        this.age = age;
        this.id = id;
    }
    // Get the student Name
    Student.prototype.getStudentName = function()
    {
        return this.name;
    };

    // Gets the student Age
    Student.prototype.getStudentAge = function()
    {
        return this.age;
    };

    // Gets the student's ID
    Student.prototype.getStudentId = function()
    {
        return this.id;
    };
    // export the class
    module.exports = Student;
    var student = new Student('Tolani', 23, 'ddr1234');
    console.log('The student name is ' + student.getStudentName());