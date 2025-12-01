import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  padding: 1em;
  cursor: pointer;
`;

const TileImage = styled.img`
  width: 5em;
  height: 5em;
`;

export const ExhibitTile = (exhibit) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/exhibit/${exhibit.id}`);
  }

  return (
    <Wrapper onClick={handleClick}>
      <h3>{exhibit.name}</h3>
      <TileImage src={exhibit.imageUrl} alt={exhibit.name} />
    </Wrapper>
  )
}