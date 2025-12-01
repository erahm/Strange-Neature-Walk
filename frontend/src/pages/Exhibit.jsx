import { styled } from "styled-components";
import { useQuery, useMutation } from "@apollo/client/react"
import { GET_EXHIBIT, DELETE_EXHIBIT, UPDATE_EXHIBIT, GET_EXHIBIT_TILES } from "../queries/exhibits"
import { GET_CATEGORIES } from "../queries/categories"
import { useNavigate, useParams } from "react-router-dom";
import { useAbility } from "../ability";
import { isManagerAdmin } from "../utilities/isManagerAdmin";
import { useState } from "react";

const ExhibitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ExhibitImage = styled.img`
  width: fit-content;
  height: fit-content;
  margin: 1rem 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  gap: 1rem;
  justify-content: space-between;
`;

const EditButton = styled.button`
  padding: .5rem;
  border-radius: 8px;
  background-color: teal;
  font-weight: bold;
  cursor: pointer;
`;

const SaveButton = styled.button`
  padding: .5rem;
  border-radius: 8px;
  background-color: green;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  padding: .5rem;
  border-radius: 8px;
  background-color: darkred;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

const EditDescrition = styled.textarea`
  width: 300px;
  height: 150px;
  margin: 1rem 0;
`;

export default function Exhibit (props) {
  const params = useParams();
  const idParam = params?.id;
  // convert string param to integer for GraphQL Int!
  const id = idParam ? parseInt(idParam, 10) : undefined;
  const ability = useAbility();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [deleteExhibit] = useMutation(DELETE_EXHIBIT);
  const [updateExhibit] = useMutation(UPDATE_EXHIBIT);
  const { isAdmin, isManager } = isManagerAdmin(ability);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const ok = window.confirm('Are you sure you want to delete this exhibit?');
    if (!ok) return;
    try {
      // refetch the exhibit tiles query and wait for it to complete before navigating
      await deleteExhibit({ variables: { id }, refetchQueries: [{ query: GET_EXHIBIT_TILES }], awaitRefetchQueries: true });
    } catch (err) {
      console.error('delete failed', err);
      alert('Delete failed: ' + (err?.message || err));
      return;
    }
    navigate('/');
  }

  const handleUpdate = () => {
    setEditMode(false);
  }

  if (ability && ability.cannot('read', 'Exhibit')) {
    return <p>Access Denied</p>;
  }

  if (!id) {
    return <p>Invalid exhibit ID</p>
  }

  const { data, loading, error } = useQuery(GET_EXHIBIT, { variables: { id } });
  const exhibit = data?.exhibit;

  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_CATEGORIES);
  const categories = categoriesData?.exhibitCategories || [];

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }

  if (!exhibit) {
    return <p>Exhibit not found</p>
  }

  return (
    <div>
      { !editMode &&
      <ExhibitWrapper>
        <h2>{exhibit.name}</h2>
        <p>({exhibit.category.name})</p>
        <ExhibitImage src={exhibit.imageUrl} alt={exhibit.name} />
        <p>{exhibit.description}</p>
        <h3>How neat is that?</h3>
        <ButtonWrapper>
        {( isAdmin || isManager ) && (
          <EditButton onClick={handleEditClick}>Edit Exhibit</EditButton>
        )}
        { isAdmin && <DeleteButton onClick={handleDelete}>Delete Exhibit</DeleteButton> }
        </ButtonWrapper>
      </ExhibitWrapper>
    }
    { editMode && 
      <ExhibitWrapper>
        <input type="text" defaultValue={exhibit.name} />
        <select style={{marginTop: '1rem'}} defaultValue={exhibit.category.id}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <ExhibitImage src={exhibit.imageUrl} alt={exhibit.name} />
        <input type="text" defaultValue={exhibit.imageUrl} />
        <EditDescrition defaultValue={exhibit.description} />
        <ButtonWrapper>
          <SaveButton onClick={handleUpdate}>Save</SaveButton>
          <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
        </ButtonWrapper>
      </ExhibitWrapper>
    }
    </div>
  )
}