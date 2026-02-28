import axiosInstance from "./axiosinstance";

export const getcategories = async()=>{
    const res = await axiosInstance.get("/getcategory")
    return res.data;
}

export const getfooditems = async()=>{
    const res = await axiosInstance.get("/getfooditems")
    return res.data;
}

export const singleprodctapi = async(id)=>{
   const res =  await axiosInstance.get(`/singlefood/${id}`)
   return res.data;
}

export const addfooditem = async(userdata)=>{
    const res = await axiosInstance.post("/additem",userdata)
    return res.data;
}

export const deletefood = async(id)=>{
    const res = await axiosInstance.delete(`/fooditem/${id}`)
    return res.data;
}

export const updatefooditem = async(id,userdata)=>{
    const res = await axiosInstance.put(`/updteitem/${id}`,userdata)
    return res.data;
}

export const orderapi =  async()=>{
    const res = await  axiosInstance.get('/allorders')
    return res.data;
}

export const updateorderApi = async(id,newStatus)=>{
    const res = await axiosInstance.put(`/updateorder/${id}`,{status:newStatus})
    return res.data;
}

export const addcategoryApi = async(userdata)=>{
    const res = await axiosInstance.post('/addcategory',userdata)
    return res.data;
}

export const deletcatrogyapi = async(id)=>{
    const res = await axiosInstance.delete(`/deletecategory/${id}`)
    return res.data;
}

export const addcartApi = async(foodId,quantity)=>{
    const res = await axiosInstance.post("/addcart",{foodId,quantity})
    return res.data;
}

export const clearcartApi = async()=>{
    const res = await axiosInstance.post("/clearcart")
    return res.data;
}

export const getcartapi = async()=>{
    const res = await axiosInstance.get('/getcart')
    return res.data;
}

export const removecartApi = async(id)=>{
    const res = await axiosInstance.delete(`/removecart/${id}`)
    return res.data;
}

export const userApi = async()=>{
   const res = await axiosInstance.get('/profile')
   return res.data;
}

// razorypay paymet api
export const createorderApi = async(data)=>{
    const res = await axiosInstance.post(`/createorder`,data)
    return res.data;
}
export const verifypaymentApi = async(data)=>{
    const res =  await axiosInstance.post('/verify-payment',data)
    return res.data;
}

export const adminDashboardApi = async()=>{
    const res = await axiosInstance.get('/admin/dashboard-stats')
    return res.data;
}

export const userDashboardApi = async()=>{
    const res = await axiosInstance.get('/user/dashboard-stats')
    return res.data;
}
