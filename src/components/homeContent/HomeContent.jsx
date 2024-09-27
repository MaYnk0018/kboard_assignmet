"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../ui/button"; // Shadcn Button component
import { Input } from "../ui/input"; // Shadcn Input component
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle
} from "../ui/dialog"; // Shadcn Dialog component
import { Loader2, PlusCircle } from "lucide-react"; // Icon for loading and UI enhancements
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "./HomeContent.css";
import AxiosService from "../../app/utils/AxiosService";
import ApiRoutes from "../../app/utils/ApiRoutes";
import AddProjectCard from "../common/addProjectCard/AddProjectCard";

function HomeContent() {
  const [show, setShow] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getLoginToken = localStorage.getItem("loginToken");
    if (getLoginToken) {
      try {
        const decoded = jwtDecode(getLoginToken);
        setUserId(decoded.userId);
      } catch (error) {
        toast.error("Invalid or corrupted token. Please login again.");
      }
    }
  }, []);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddProject = async (e) => {
    setLoading(true);
    e.preventDefault();
    let datas = { projectName: projectName,userId: userId };
    try {
      const getLoginToken = localStorage.getItem("loginToken"); 
      let res = await AxiosService.post(
        `${ApiRoutes.ADDPROJECT.path}/${userId}`,
        datas,
        { headers: { Authorization: `${getLoginToken}` } }
      );
      setLoading(false);
      handleClose();
      toast.success("Project added successfully!");
      getProjectsList(); // Refresh project list after adding
    } catch (error) {
      if (error.request) {
        toast.error("Network error: Please check your connection.");
      } else {
        toast.error("Unexpected error: " + error.message);
      }
      setLoading(false);
    }
  };

  const getProjectsList = async () => {
    try {
      let res = await AxiosService.get(
        `${ApiRoutes.GETPROJECTSLIST.path}/${userId}`,
        {
          headers: { Authorization: `${getLoginToken}` },
        }
      );
      if (res.status === 200) {
        setProjectsList(res.data.projects);
      }
    } catch (error) {
      if (error.request) {
        toast.error("Network error: Please check your connection.");
      } else {
        toast.error("Unexpected error: " + error.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjectsList();
  }, []);

  const memoizedProjects = useMemo(() => projectsList, [projectsList]);

  return (
    <>
      <div className="m-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold">My Projects</h2>
          <Button
            onClick={handleShow}
            variant="outline"
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" /> Add Project
          </Button>
        </div>

        <div className="projectArea m-2 p-4 border rounded-lg shadow-sm bg-muted">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {memoizedProjects.length > 0 ? (
              memoizedProjects.map((e, i) => (
                <AddProjectCard cardData={e} key={i} className="mb-4" />
              ))
            ) : (
              <p className="emptyText text-center mx-auto text-muted-foreground">
                No Projects Created
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Shadcn Dialog for Modal */}
      <Dialog open={show} onOpenChange={setShow}>
      <DialogTitle>My Dialog Title</DialogTitle>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <h2 className="text-lg font-semibold">Add New Project</h2>
          </DialogHeader>
          <form onSubmit={handleAddProject}>
            <div className="space-y-4 py-4">
              <div className="form-group">
                <label htmlFor="projectname" className="text-sm font-medium">
                  Project Name
                </label>
                <Input
                  type="text"
                  id="projectname"
                  placeholder="Enter project name"
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default HomeContent;
