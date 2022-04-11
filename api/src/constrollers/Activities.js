const { Country, Tourist_activity } = require("../db");

const newActivity = async (req, res) => {
  try {
    const {type, name, difficulty, duration, season, countryId } = req.body;
    const arrayId = countryId.map((e) => e.toUpperCase());
    
    const newAct = await Tourist_activity.create({
      type: type,
      name: name,
      difficulty: difficulty,
      duration: duration,
      season: season,
    });

    arrayId.forEach(async (e) => { 
      const arrayCountries = await Country.findOne({
        where: { id: e },
      });

      await arrayCountries.addTourist_activity(newAct);
    });

    res.status(200).send("CREADO CORRECTAMENTE");
  } catch (error) {
    console.error(error);
  }
};




const getActivity = async(req , res ) =>{
    try{
      const  { name } = req.query;

      if(name === "all"){
        
        const allActivities = await Tourist_activity.findAll({
          include: Country
        });
  
        const mapActivities = await allActivities.map(e => e.countries).flat() 

        //*Unificar actividades, no se veran repetidas en el paginado
        const hash = {};
        const finalActivities = mapActivities.filter((current)=> {
          var exists = !hash[current.id];
          hash[current.id] = true;
          return exists;
        });
       
        res.status(200).json(finalActivities);
      
      }else{
        const dataFiltered = await Tourist_activity.findAll({
          include: Country
        });
  
        const result = await dataFiltered.filter(e => e.type === name).map(e => e.countries).flat()
        res.json(result)
      } 
    }catch(error){
      console.log(error)
    }
} 

const getNameActivities = async (req, res)=>{

    const { name } = req.query;
    Tourist_activity.findAll({
      where: { name: name },
      include: Country
    }).then((resp)=> res.status(200).json(resp))
    .catch((error)=> console.log(error))



  /*   try{
    const { name } = req.query;
    const result = await Tourist_activity.findAll({
      where: { name: name },
      include: Country
    })

    res.status(200).json(result)

  } catch(err){
    console.log(err)
  } */
}

const deleteActivity = async(req, res)=>{

  const { name } = req.query;

  Tourist_activity.destroy({
    where: { name: name }
  }).then(resp => res.status(200).json(resp))
  .catch((error)=> console.log(error))

  /*   try{
      const { name } = req.query;

      const allActivities = await Tourist_activity.destroy({
      where: { name: name }
    })

    res.status(200).send("Elemento borrado")
  }catch(error){
    console.log(error)
  } */
}

const updateActivity = async (req,res)=>{

  Tourist_activity.update({
    name: req.body.name,
    difficulty: req.body.difficulty,
    duration: req.body.duration,
    season: req.body.season
  }, {
    where: {
      name: req.params.name
    }
  }).then(resp => res.status(200).json(resp))
  .catch((error)=> console.log(error))


/*   try{
    const update = await Tourist_activity.update({
      name: req.body.name,
      difficulty: req.body.difficulty,
      duration: req.body.duration,
      season: req.body.season
    }, {
      where: {
        name: req.params.name
      }
    })

    res.status(200).json(update)

  }catch(err){
    console.log(err)
  } */

}


module.exports = { newActivity, getActivity, getNameActivities, deleteActivity, updateActivity };
