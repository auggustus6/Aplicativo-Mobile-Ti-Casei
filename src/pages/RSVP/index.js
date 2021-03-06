import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';

import api from '~/services/api';

import {
    Container,
    TitleForm,
    FormContainer,
    FormGroup,
    Label,
    InputDate,
    InputText,
    Select,
    ContainerSelects,
    ButtonSubmit,
    TextButton
} from './styles';


function RSVP() {
    const married = useSelector(state => state.married);
    const [form, setForm] = useState({
        guest: '',
        phoneNumber: null,
        presence: true,
        adults: 1
    })

    clearInputs = () => {
        setForm({
            guest: '',
            phoneNumber: null,
            presence: true,
            adults: 1
        })
    }

    formatDate = () => {
        const [date, ...rest] = married.dataMarried.date.split('T');
        const d = date.split('-');
        const newDate = d.reverse().join('/');
        return newDate;
    }

    handlePresence = async () => {
        if(form.guest === '') return;
        const res = await api.post(`married/${married.dataMarried.id}/confirmPresence`, form);
        
        if (res.status === 200) {
            Alert.alert('Obrigado', res.data.message);
            clearInputs()
        } else {
            Alert.alert('Opa!', res.data.message);
        }
    }

    return (
        <Container>
            <FormContainer>
                <TitleForm>Confirme sua presença</TitleForm>
                <FormGroup>
                    <InputDate
                        placeholder="Data do casamento"
                        placeholderTextColor="#333"
                        editable={false}
                        value={formatDate()}
                        underlineColorAndroid='transparent'
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Nome do convidado (igual ao convite) </Label>
                    <InputText
                        placeholderTextColor="#333"
                        onChangeText={guest => setForm({ ...form, guest })}
                        value={form.guest}
                        underlineColorAndroid='transparent'
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Telefone para contato</Label>
                    <InputText
                        placeholderTextColor="#333"
                        onChangeText={phoneNumber => setForm({ ...form, phoneNumber })}
                        value={form.phoneNumber}
                        underlineColorAndroid='transparent'
                    />
                </FormGroup>

                <ContainerSelects>
                    <FormGroup
                        select={true}>
                        <Label>Você irá ao evento</Label>
                        <Select
                            selectedValue='Sim'
                            onValueChange={(item, itemIndex) => {
                                setForm({ ...form, presence: item })
                            }}>
                            <Select.Item label="Sim" value="Sim" />
                            <Select.Item label="Não" value="Não" />
                        </Select>
                    </FormGroup>

                    <FormGroup
                        select={true}>
                        <Label>Quantos adultos?</Label>
                        <Select
                            selectedValue={form.adults}
                            onValueChange={(item, itemIndex) => {
                                setForm({ ...form, adults: item })
                            }}>
                            <Select.Item label="1" value="1" />
                            <Select.Item label="2" value="2" />
                            <Select.Item label="3" value="3" />
                            <Select.Item label="4" value="4" />
                        </Select>
                    </FormGroup>

                </ContainerSelects>

                <ButtonSubmit onPress={handlePresence}>
                    <TextButton>Confirmar</TextButton>
                </ButtonSubmit>

            </FormContainer>
        </Container>
    );
}

RSVP.navigationOptions = ({ navigation }) => {
    return {
        title: 'RSVP',
    }
}

export default RSVP;
