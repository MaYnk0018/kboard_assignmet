"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { jwtDecode } from 'jwt-decode'
import './ProjectCardContent.css'
import AxiosService from '../../app/utils/AxiosService'
import ApiRoutes from '../../app/utils/ApiRoutes'
import Board from '../kanbanBoard/Board'

const ProjectCardContent = () => {
    const router = useRouter()
    const { id } = useParams(); // Destructure id from query

    const taskTitle = useRef(null)
    const taskDescription = useRef(null)
    const taskStatus = useRef(null)

    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [tasksList, setTasksList] = useState([])
    const [inComplete, setInComplete] = useState([])
    const [workingTask, setWorkingTask] = useState([])
    const [completed, setCompleted] = useState([])
    const [currentProjectCard, setCurrentProjectCard] = useState([])

    const getLoginToken = typeof window !== "undefined" ? localStorage.getItem('loginToken') : null
    let decodedToken = getLoginToken ? jwtDecode(getLoginToken) : null
    let userId = decodedToken?.userId

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleAddTask = async (e) => {
        setLoading(true)
        e.preventDefault()
        const UID = () => Math.random().toString(36).substring(2, 10)
        let taskData = { 
            task: {
                taskStatus: taskStatus.current.value,
                taskDetails: [
                    {
                        UID: UID(),
                        taskTitle: taskTitle.current.value.trim(),
                        taskDescription: taskDescription.current.value.trim(),
                        projectName: currentProjectCard[0]?.projectName                    
                    }
                ]
            }
        }

        try {      
            let res = await AxiosService.post(`${ApiRoutes.GETCURRENTPROJECTCARDDATA.path}/${currentProjectCard[0]?.Id}`, taskData, {
                headers: { Authorization: `${getLoginToken}` }
            })
            setLoading(false)
            if (res.status === 200) {
                toast.success(res.data.message)
                handleClose()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
            setLoading(false)
        }
    }

    const getProjectData = async () => {
        try {
            let res = await AxiosService.get(`${ApiRoutes.GETCURRENTPROJECTCARDDATA.path}/${userId}/${id}`, {
                headers: { Authorization: `${getLoginToken}` }
            })
            if (res.status === 200) {
                setCurrentProjectCard(res.data.list)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const getAllTasks = async () => {
        try {
            let res = await AxiosService.get(`${ApiRoutes.TASK.path}/${id}`, {
                headers: { Authorization: `${getLoginToken}` }
            })
            let result = res.data.list
            let todos = result.filter((task) => task.taskStatus === "Pending")
            let working = result.filter((task) => task.taskStatus === "Ongoing")
            let completed = result.filter((task) => task.taskStatus === "Completed")
            if (res.status === 200) {
                setTasksList(result)
                setInComplete(todos)
                setWorkingTask(working)
                setCompleted(completed)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        if (id) {
            getProjectData()
            getAllTasks()
        }
    }, [id])

    return (
        <div className='mx-5 my-4'>
            <nav className="flex items-center space-x-4 mb-4">
                <button onClick={() => router.push('/home')} className="text-blue-600 hover:underline">Home</button>
                <span className="font-bold">{currentProjectCard[0]?.projectName}</span>
            </nav>

            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-2xl font-bold'>Progress Board</h3>
                <button 
                    onClick={handleShow} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Add Task
                </button>
            </div>

            <div className='mt-3'>
                <Board 
                    tasksList={tasksList} 
                    inComplete={inComplete} 
                    setInComplete={setInComplete} 
                    workingTask={workingTask} 
                    setWorkingTask={setWorkingTask} 
                    completed={completed} 
                    setCompleted={setCompleted} 
                />
            </div>

            {/* Modal for adding tasks */}
            {show && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-bold mb-4">Add New Task</h2>
                        <form onSubmit={handleAddTask}>
                            <div className="mb-4">
                                <label htmlFor="taskTitle" className="block text-sm font-medium mb-1">Task Title</label>
                                <input 
                                    id="taskTitle" 
                                    type="text" 
                                    placeholder="Enter here" 
                                    ref={taskTitle}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="taskDescription" className="block text-sm font-medium mb-1">Task Description</label>
                                <input 
                                    id="taskDescription" 
                                    type="text" 
                                    placeholder="Enter here" 
                                    ref={taskDescription}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="taskStatus" className="block text-sm font-medium mb-1">Task Status</label>
                                <select 
                                    ref={taskStatus} 
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                >
                                    <option value="">Select task status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button 
                                    type="button" 
                                    onClick={handleClose} 
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                                >
                                    Close
                                </button>
                                <button 
                                    type='submit' 
                                    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProjectCardContent;
