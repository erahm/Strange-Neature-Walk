import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { useMutation, useQuery } from "@apollo/client/react"
import { CREATE_EXHIBIT, GET_EXHIBIT_TILES } from "../queries/exhibits"
import { GET_CATEGORIES } from "../queries/categories";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InputField = styled.input`
  margin: 0.5rem 0;
  padding: 0.5rem;
  width: 300px;
`;

const TextAreaField = styled.textarea`
  margin: 0.5rem 0;
  padding: 0.5rem;
  width: 300px;
  height: 150px;
`;

const SubmitButton = styled.button`
  padding: 0.5rem;
  border-radius: 8px;
  background-color: darkblue;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;


export const CreateExhibitForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState(undefined);
  const navigate = useNavigate();

  const [createExhibit] = useMutation(CREATE_EXHIBIT, {
    refetchQueries: [{ query: GET_EXHIBIT_TILES }]
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const categories = categoriesData?.exhibitCategories || [];

  useEffect(() => {
    if (categories.length > 0 && categoryId === undefined) {
      setCategoryId(categories[0].id);
    } }, [categories, categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ name, description, imageUrl, categoryId });
    try {
      await createExhibit({
        variables: { name, description, imageUrl, categoryId }
      });
      navigate('/');
    } catch (err) {
      console.error('Creation failed', err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputField
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select style={{marginTop: '1rem'}} value={categoryId || ''} onChange={(e) => setCategoryId(Number(e.target.value))}>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <TextAreaField
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <InputField
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        required
      />
      <SubmitButton type="submit">Create Exhibit</SubmitButton>
    </Form>
  )
}