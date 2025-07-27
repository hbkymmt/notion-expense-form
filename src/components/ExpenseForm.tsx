import React, { useState, useEffect } from "react";
import { API_URL } from "../config";
import '../App.css';

const ExpenseForm: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [item, setItem] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [method, setMethod] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        const today = new Date();
        const formatted = today.toISOString().split("T")[0];
        setDate(formatted);
    }, []);

    const handleSubmit = async () => {
        if (!amount || !item || !date || !category || !method) {
            alert("Fill in the all blank!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/add-expense`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount,
                    item,
                    category,
                    date,
                    method,
                    notes
                })
            });

            if (response.ok) {
                alert("Expenses Added!");
                setAmount('');
                setItem('');
                setCategory('');
                setDate('');
                setMethod('');
                setNotes('');
            } else {
                alert("A networking error has occured.");
            }
        } catch (error) {
            alert("Internet connection has failed.");
            console.error(error);
        }
    };

    return (
        <div className="form-container">
            <h2>Add an expense!</h2>
            <div className="form-grid">
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Item"
                    value={item}
                    onChange={e => setItem(e.target.value)}
                />
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">-- Select Category --</option>
                    <option value="Food & Drinks">Food & Drinks</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Home">Home</option>
                    <option value="Transport">Transport</option>
                    <option value="Subscription">Subscription</option>
                    <option value="Others">Others</option>
                </select>
                <select value={method} onChange={e => setMethod(e.target.value)}>
                    <option value="">-- Select Method --</option>
                    <option value="楽天Mastercard">楽天Mastercard</option>
                    <option value="楽天Visa">楽天Visa</option>
                    <option value="三井Visa">三井住友Visa</option>
                    <option value="デビット">デビット</option>
                </select>
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />
                <textarea
                    placeholder="Notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                />
                <button onClick={handleSubmit}>Add</button>
            </div>
        </div>
    );
};

export default ExpenseForm;
