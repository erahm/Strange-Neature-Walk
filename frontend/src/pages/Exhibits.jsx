import { useQuery } from "@apollo/client/react"
import { GET_EXHIBIT_TILES } from "../queries/exhibits"
import { ExhibitTile } from "../components/ExhibitTile"
import { styled } from "styled-components";
import { isManagerAdmin } from "../utils/isManagerAdmin";
import { useAbility } from "../ability";
import { useNavigate } from "react-router-dom";

const TileWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const CreateButton = styled.button`
  padding: .5rem;
  border-radius: 8px;
  background-color: darkgreen;
  color: white;
  font-weight: bold;
  cursor: pointer;
  `;

export const Exhibits = () => {
  const { data, loading, error } = useQuery(GET_EXHIBIT_TILES);
  const ability = useAbility();
  const { isAdmin } = isManagerAdmin(ability);
  const navigate = useNavigate();

  const handleCreateExhibit = () => {
    navigate('/exhibit/create');
  }

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }

  const { exhibits } = data;

  return (
    <PageWrapper>
      <h2>Take a Neature Walk and see some Strange things</h2>
      <TileWrapper>
        {exhibits.map((exhibit) => (
          <ExhibitTile key={exhibit.id} {...exhibit} />
        ))}
      </TileWrapper>
      {isAdmin && <CreateButton onClick={handleCreateExhibit}>Create New Exhibit</CreateButton>}
    </PageWrapper>
  )
}
