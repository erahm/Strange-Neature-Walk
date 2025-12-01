import { styled } from "styled-components";
import { useQuery } from "@apollo/client/react"
import { GET_EXHIBIT } from "../queries/exhibits"
import { useParams } from "react-router-dom";

const ExhibitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ExhibitImage = styled.img`
  width: 20em;
  height: 20em;
`;

export default function Exhibit (props) {
  const params = useParams();
  const idParam = params?.id;
  // convert string param to integer for GraphQL Int!
  const id = idParam ? parseInt(idParam, 10) : undefined;
  console.log('id: ', id);
  if (!id) {
    return <p>Invalid exhibit ID</p>
  }

  const { data, loading, error } = useQuery(GET_EXHIBIT, { variables: { id } });

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }

  const { exhibit } = data;

  return (
    <ExhibitWrapper>
      <h2>{exhibit.name}</h2>
      <ExhibitImage src={exhibit.imageUrl} alt={exhibit.name} />
      <p>{exhibit.description}</p>
      <h3>How neat is that?</h3>
    </ExhibitWrapper>
  )
}