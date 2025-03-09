/* eslint-disable */
const apiUrl = 'https://pfback-osdi.onrender.com';
// const apiUrl = 'http://localhost:3000';

export const createPayment = async (data: any) => {
    try {
        const response = await fetch(`${apiUrl}/payments`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const result = await response.json();
        return result;
    } catch (error) {
        console.log(error);
    }
};

export const updatePayment = async (id: string, data: any) => {
    try {
        const response = await fetch(`${apiUrl}/payments/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const result = await response.json();
        return result;
    } catch (error) {
        console.log(error);
    }
};