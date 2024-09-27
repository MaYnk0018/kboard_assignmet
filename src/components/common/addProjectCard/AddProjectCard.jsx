"use client";

import React, { useState, useEffect } from "react";
import { Card, Col, Button, Modal, Form, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import useFormattedDateTime from "../../hooks/UseFormattedDateTime";
import "./AddProjectCard.css";
import AxiosService from '../../../app/utils/AxiosService'
// import ApiRoutes from '../../../utils/ApiRoutes'

function AddProjectCard({ cardData }) {
  const router = useRouter();
  const formattedDateTime = useFormattedDateTime(cardData.createdAt);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [cardProjectName, setCardProjectName] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set flag to indicate client-side rendering
  }, []);

  const getLoginToken = isClient ? localStorage.getItem("loginToken") : null;

  const handleClose = () => setShow(false);
  const handleShow = (userId, projectId) => {
    getCardData(userId, projectId);
  };

  const handleEditProjectCard = async (projectId) => {
    setLoading(true);
    const updatedData = { projectName };
    try {
      // Mock response for editing a project
      // let res = await AxiosService.put(`${ApiRoutes.UPDATEPROJECT.path}/${projectId}`, updatedData, { headers: { 'Authorization': `${getLoginToken}` } })
      let res = { status: 200 }; // Mock response
      handleClose();
      setLoading(false);
      toast.success("Project updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const handleDeleteProjectCard = async (projectId) => {
    try {
      // Mock response for deleting a project
      // let res = await AxiosService.delete(`${ApiRoutes.DELETECURRENTPROJECT.path}/${projectId}`, { headers: { 'Authorization': `${getLoginToken}` } })
      let res = {
        status: 200,
        data: { message: "Project deleted successfully" },
      }; // Mock response
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getCardData = async (userId, projectId) => {
    try {
      // Mock response for getting project data
      // let res = await AxiosService.get(`${ApiRoutes.GETCURRENTPROJECTCARDDATA.path}/${userId}/${projectId}`, { headers: { 'Authorization': `${getLoginToken}` } })
      let res = {
        status: 200,
        data: {
          list: [{ projectId: projectId, projectName: "Sample Project" }],
        },
      }; // Mock response
      setCardProjectName(res.data.list);
      setShow(true);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <Col>
        <Card style={{ width: "20rem", minHeight: "7rem" }}>
          <Card.Body className="d-flex cardDatas">
            <div className="d-flex flex-row justify-content-between">
              <div
                className="cardText"
                onClick={() => router.push(`/home/${cardData.projectId}`)}
              >
                <p style={{ fontSize: "large" }}>{cardData.projectName}</p>
              </div>
              <div className="buttons d-flex">
                <div
                  className="editBtn"
                  onClick={() =>
                    handleShow(cardData.userId, cardData.projectId)
                  }
                >
                  <FontAwesomeIcon icon={faEdit} />
                </div>
                <div
                  className="deleteBtn"
                  onClick={() => handleDeleteProjectCard(cardData.projectId)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </div>
              </div>
            </div>
            <hr className="my-2" />
            <p className="mb-0" style={{ fontSize: "small" }}>
              Created At: {formattedDateTime}
            </p>
          </Card.Body>
        </Card>
      </Col>

      <Modal show={show} onHide={handleClose}>
        <Form>
          <Modal.Header closeButton>
            <Modal.Title>Edit Project Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                defaultValue={cardProjectName[0]?.projectName}
                placeholder="Enter here"
                name="projectname"
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                handleEditProjectCard(cardProjectName[0]?.projectId)
              }
              disabled={loading}
            >
              {loading ? <Spinner animation="border" /> : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default AddProjectCard;
