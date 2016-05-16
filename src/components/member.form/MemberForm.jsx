import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import { Input } from 'formsy-react-components';
import { Form } from 'formsy-react';

import AltContainer from 'alt-container';
import StudentIdStore from '../../stores/StudentIdStore';
import StudentIdActions from '../../actions/StudentIdActions';

import AddStudentCardId from '../member.addid/AddStudentCardId.jsx';

import styles from './MemberForm-style.css';

class MemberForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitDisabled: true
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onValid = this.onValid.bind(this);
    this.onInvalid = this.onInvalid.bind(this);
  }
  componentWillMount() {
    const { editMember, actions } = this.props;
    if( editMember ) {
      actions.setStudentId( editMember.studentCardId );
    }
    else {
      actions.setStudentId('');
    }
  }
  onSubmit(model,reset,invalidate) {
    const { submit } = this.props;
    submit(model,reset,invalidate);
  }
  onValid() {
    this.setState({ submitDisabled: false });
  }
  onInvalid() {
    this.setState({ submitDisabled: true });
  }
  render () {
    const { editMember, ...idProps } = this.props;

    const addEdit = editMember ? 'Endre' : 'Legg til';

    const defaultValues = {
        firstName: editMember ? editMember.firstName : '',
        lastName: editMember ? editMember.lastName : '',
        userName: editMember ? editMember.userName : '',
        privateEmail: editMember ? editMember.privateEmail : '',
        mobile: editMember ? editMember.mobile : '',
        studentCardId: editMember ? editMember.studentCardId : ''
    }

    const header = `${addEdit} medlem`;

    return(
      <Form
        onValidSubmit={this.onSubmit}
        onValid={this.onValid}
        onInvalid={this.onInvalid}
        className={styles.form}
      >
        <fieldset>
          <legend>{header}</legend>
          <Input
            name="firstName"
            id="firstName"
            value={defaultValues.firstName}
            label="Fornavn"
            type="text"
            validations={{
              matchRegexp: /^[a-zA-Z \-,.()]*$/
            }}
            validationErrors={{
              matchRegexp: 'Kun bokstaver og bindestreker er godtatt'
            }}
            placeholder="Medlemmets fornavn"
            required
            />

          <Input
            name="lastName"
            value={defaultValues.lastName}
            label="Etternavn"
            type="text"
            validations="isAlpha"
            validationErrors={{
              isAlpha: 'Kun bokstaver er godtatt'
            }}
            placeholder="Medlemmets etternavn"
            required
            />

          <Input
            name="userName"
            value={defaultValues.userName}
            label="Brukernavn"
            type="text"
            validations="isAlphanumeric"
            validationErrors={{
              isAlphanumeric: 'Kun bokstaver og tall er godtatt'
            }}
            placeholder="Medlemmets brukernavn på UIT"
            required
            />

          <Input
            name="privateEmail"
            value={defaultValues.privateEmail}
            label="Privat e-post"
            type="email"
            autoComplete="off"
            placeholder="Medlemmets private e-post (xxx@xxx.xxx)"
            validations="isEmail"
            validationErrors={{
              isEmail: 'Dette ser ikke ut som en gyldig e-postadresse'
            }}
            />

          <Input
            name="mobile"
            value={defaultValues.mobile}
            label="Telefonnummer"
            type="text"
            autoComplete="off"
            placeholder="Medlemmets telefonnummer ( xxxxxxxx )"
            validations="isNumeric,isLength:8"
            validationErrors={{
              isNumeric: 'Dette ser ikke ut som et gyldig telefonnummer',
              isLength: 'Krever 8 siffer'
            }}
            />

          <AddStudentCardId {...idProps} />

        </fieldset>
        
        <div className={styles.btnBox}>
          <input type="submit" className="btn btn-primary" formnovalidate={true}
            disabled={this.state.submitDisabled} value={addEdit} />
        </div>

      </Form>
    );
  }
}

const storeConnect = (props) => {
  return (
    <AltContainer store={StudentIdStore} actions={{ actions: StudentIdActions }} >
      <MemberForm {...props} />
    </AltContainer>
  );
}

export default storeConnect;
