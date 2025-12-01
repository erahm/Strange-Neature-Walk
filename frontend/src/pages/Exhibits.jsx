import { useQuery } from "@apollo/client/react"
import { GET_EXHIBIT_TILES } from "../queries/exhibits"
import { ExhibitTile } from "../components/ExhibitTile"
import { styled } from "styled-components";

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

export default function Exhibits () {
  const { data, loading, error } = useQuery(GET_EXHIBIT_TILES);

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
    </PageWrapper>
  )
}
