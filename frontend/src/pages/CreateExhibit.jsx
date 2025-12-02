import { styled } from "styled-components";
import { CreateExhibitForm } from "../components/CreatExhibitForm";

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const CreateExhibit = () => {
  return (
    <FormWrapper>
      <h2>Create New Exhibit</h2>
      <CreateExhibitForm />
    </FormWrapper>
  )
}

