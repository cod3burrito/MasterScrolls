import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CharacterList from '../CharacterList'
import Collapsible from 'react-collapsible'
import Button from 'react-bootstrap/Button';
import { useMutation } from '@apollo/client';
import { EDIT_LOCATION, DELETE_LOCATION } from '../../utils/mutations';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';

const LocationList = ({ locations, allLocations, setAllLocations }) => {
    const [edit] = useMutation(EDIT_LOCATION)
    const [deleteState] = useMutation(DELETE_LOCATION);
    const [showModal, setShowModal] = useState(false);
    const [stateLocation, setStateLocation] = useState({ name: "", details: "", _id: "" })
    
    const { campaignId: campaignParam } = useParams();

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleChange = (event => {
        const name = event.target.name;
        const value = event.target.value;
        setStateLocation({
            ...stateLocation,
            [name]: value
        })
    })

    const editLocation = async () => {
        try {
            if (stateLocation.name) {
                const { name, details } = stateLocation;
                console.log(name);
                console.log(details)
                const { data } = await edit({
                    variables: { name, details, locationId: stateLocation._id, campaignId: campaignParam }
                });


                // setStateLocation({
                //     name: data.editLocation.name,
                //     details: data.editLocation.details
                // })

                handleClose();
            }
        } catch (err) {
            console.log(err);
        }
    }

    const deleteLocation = async (id) => {
        try{
            const { data } = await deleteState({
                variables: {locationId: id, campaignId: campaignParam}
            })


        }catch (err){
            console.log(err);
        }
    }

    if (!locations) {
        //this should be impossible since we have a default one made
        return (<h3>No Locations in this campaign yet!</h3>)
    }
    console.log(locations)
    return (
        <>
            <div className='d-flex flex-wrap'>
                {locations.map((location) => {
                    return (
                        <>
                        <div className= "card m-2 d-flex align-items-center border border-dark" style={{width: "18rem"}}>
                            <h2>{location.name}</h2>
                        <div>   
                        <Button size="sm" className="mx-2 rounded-pill" style={{width: "7rem"}} onClick={()=> {
                            setStateLocation({name: location.name , details: location.details, _id: location._id})
                            handleShow()}}>Edit Location</Button>
                            <Button size="sm" className="mx-2 rounded-pill"  onClick={() => {                            
                            deleteLocation(location._id);
                        }}>Delete Location</Button>
                        </div> 
                        <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Location</Modal.Title>
                </Modal.Header>    
                <Modal.Body>
                    <form style={{ display: "flex", flexDirection: "column" }}>
                        <p >Location Name:</p>
                        <input
                            className="form-input"
                            placeholder="Location Name"
                            name="name"
                            type="text"
                            id='name-input'
                            value={stateLocation.name}
                            onChange={handleChange}
                        />
                        <br></br>

                                            <p >Details:</p>
                                            <input
                                                className="form-input"
                                                placeholder="Location Details"
                                                name="details"
                                                type="test"
                                                value={stateLocation.details}
                                                onChange={handleChange}
                                            />
                                        </form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button onClick={handleClose}>Close</Button>
                                        <Button onClick={editLocation}>Edit</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Collapsible key={location._id} trigger={"View Characters"}>
                                    <ul className='list-group list-group-flush'>
                                        <CharacterList locationId={location._id} characters={location.characters} />
                                    </ul>
                                </Collapsible>
                            </div>
                        </>
                    )
                })}
            </div>
        </>
    )
}

export default LocationList