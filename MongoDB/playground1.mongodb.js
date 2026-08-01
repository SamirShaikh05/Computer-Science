use("CrudDB")

// create operation

db.createCollection("courses")

// db.courses.insertOne({
//   "name": "Mongodb",
//   "price": 0,
//   "instructor": "harry bhai"
// })

// db.courses.insertMany([
//   {
//     "name": "Node.js",
//     "price": 0,
//     "instructor": "harry bhai"
//   },
//   {
//     "name": "Express.js",
//     "price": 0,
//     "instructor": "harry bhai"
//   },
//   {
//     "name": "React",
//     "price": 0,
//     "instructor": "harry bhai"
//   },
//   {
//     "name": "JavaScript",
//     "price": 0,
//     "instructor": "harry bhai"
//   },
//   {
//     "name": "HTML & CSS",
//     "price": 0,
//     "instructor": "harry bhai"
//   },
//   {
//     "name": "Tailwind CSS",
//     "price": 0,
//     "instructor": "harry bhai"
//   },
//   {
//     "name": "TypeScript",
//     "price": 0,
//     "instructor": "harry bhai"
//   },
//   {
//     "name": "Next.js",
//     "price": 0,
//     "instructor": "harry bhai"
//   },
//   {
//     "name": "Firebase",
//     "price": 0,
//     "instructor": "harry bhai"
//   }
// ]
// )

// Read

// let a = db.courses.find({price:0})
// console.log(a.count());


//  let b = db.courses.findOne({price: 0}) 

//  console.log(b)

// Update

// db.courses.updateOne({price:0}, {$set:{price:100}})
// db.courses.updateMany({price:0}, {$set:{price:1000}})

// Delete

// db.courses.deleteMany({price:100})
// db.courses.deleteMany({price:1000})