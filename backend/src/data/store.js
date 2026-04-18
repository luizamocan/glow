
let services = [
  { id: 1, name: "Facial",          price: 50,  duration: 60,  description: "Deep skin cleansing treatment" },
  { id: 2, name: "Haircut",         price: 35,  duration: 45,  description: "Precision haircut & styling" },
  { id: 3, name: "Manicure",        price: 30,  duration: 90,  description: "Full manicure service" },
  { id: 4, name: "Spa Treatment",   price: 100, duration: 120, description: "Full body spa relaxation" },
  { id: 5, name: "Pedicure",        price: 40,  duration: 60,  description: "Full pedicure with nail polish" },
  { id: 6, name: "Eyebrow Shaping", price: 25,  duration: 30,  description: "Professional eyebrow threading" },
  { id: 7, name: "Hair Coloring",   price: 80,  duration: 90,  description: "Full hair coloring" },
  { id: 8, name: "Deep Massage",    price: 70,  duration: 75,  description: "Relaxing deep tissue massage" },
];

let nextId=9;

const getAll=()=> services;

const getById= (id)=>services.find(s=> s.id==id);

const create = (data)=>{
    const newService= {id:nextId++,...data};
    services.push(newService);
    return newService;
};

const update= (id,data)=>{
    const index=services.findIndex(s=> s.id==id);
    if(index == -1) return null;
    services[index]= {...services[index],...data};
    return services[index];
};

const remove = (id)=>{
    const index=services.findIndex(s=> s.id==id);
    if(index==-1) return null;
    services.splice(index,1);
    return true;
};

const reset =()=>{
    services = [
    { id: 1, name: "Facial",          price: 50,  duration: 60,  description: "Deep skin cleansing treatment" },
    { id: 2, name: "Haircut",         price: 35,  duration: 45,  description: "Precision haircut & styling" },
    { id: 3, name: "Manicure",        price: 30,  duration: 90,  description: "Full manicure service" },
    { id: 4, name: "Spa Treatment",   price: 100, duration: 120, description: "Full body spa relaxation" },
    { id: 5, name: "Pedicure",        price: 40,  duration: 60,  description: "Full pedicure with nail polish" },
    { id: 6, name: "Eyebrow Shaping", price: 25,  duration: 30,  description: "Professional eyebrow threading" },
    { id: 7, name: "Hair Coloring",   price: 80,  duration: 90,  description: "Full hair coloring" },
    { id: 8, name: "Deep Massage",    price: 70,  duration: 75,  description: "Relaxing deep tissue massage" },
  ];
  nextId = 9;
};

module.exports = {getAll,getById,create,update,remove,reset};