import AddDepartment from '@/components/agency.components/agencyside.components/addDepartment';
import CreateEmployee from '@/components/agency.components/agencyside.components/create.employee';
import axios from '@/utils/axios';
import React, { useEffect, useState } from 'react'
import { CiSquarePlus } from "react-icons/ci";


const AgencyEmployees = () => {
    const [isAddDepartmentClicked, setIsAddDepartmentClicked] = useState<boolean>(false)
    const [isAddEmployeeClicked, setIsAddEmployeeClicked] = useState<boolean>(false)
    const [employees, setEmployees] = useState<any>([])
    const [departments, setDepartments] = useState<any>([])

    const fetchAllEmployees = async () => {
        try {
            const res = await axios.get('/api/entities/get-employees')
            if (res) setEmployees(res.data.employees)
        } catch (error: any) {
            console.log(error);
        }
    }

    const fetchAllDepartment = async () => {
        try {
            const res = await axios.get('/api/entities/get-departments')
            if (res) setDepartments(res.data.departments)
        } catch (error: any) {
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchAllEmployees()
        fetchAllDepartment()
    },[])

    console.log("employees",employees,"departments",departments);


    return (
        <div className="w-full p-9">
            <div className="w-full flex lg:justify-start  justify-center mt-6">
                <div className="w-full min-h-[11rem] rounded-xl border-2 border-gray-200 bg-white p-5  transition-all duration-300 mt">
                    <div className="flex w-full justify-between items-center">
                        <h1 className='text-md cantarell font-cantarell pb-4 font-semibold'>Employees</h1>
                        <CiSquarePlus className='w-5 h-5 cursor-pointer mb-4 font-semibold' onClick={() => setIsAddEmployeeClicked(true)} />
                    </div>
                    <div className="w-full  border-t-2 border-gray-200  gap-5  ">
                        {employees.map((item: any, index: number) => (
                            <div key={index} className="w-full cursor-pointer hover:shadow-md rounded-sm transition-all duration-200 min-h-12 flex items-center text-sm" >{item.name || ""}</div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-[37rem] flex lg:justify-start  justify-center mb-6 mt-4">
                <div className="w-full min-h-[11rem] rounded-xl border-2 border-gray-200 bg-white p-5  transition-all duration-300 mt">
                    <div className="flex w-full justify-between items-center">
                        <h1 className='text-md cantarell font-cantarell pb-4 font-semibold'>Departments</h1>
                        <CiSquarePlus className='w-5 h-5 cursor-pointer mb-4 font-semibold' onClick={() => setIsAddDepartmentClicked(true)} />
                    </div>

                    <div className="w-full  border-t-2 border-gray-200  gap-5  ">
                        {departments.map((item: any, index: number) => (
                            <div key={index} className="w-full cursor-pointer hover:shadow-md rounded-sm transition-all duration-200 min-h-12 flex items-center text-sm" >{item.department || ""}</div>
                        ))}
                    </div>
                </div>

            </div>
            {isAddDepartmentClicked && <AddDepartment setIsAddDepartmentClicked={setIsAddDepartmentClicked} />}
            {isAddEmployeeClicked && <CreateEmployee setIsAddEmployeeClicked={setIsAddEmployeeClicked} />}

        </div>
    )
}

export default AgencyEmployees