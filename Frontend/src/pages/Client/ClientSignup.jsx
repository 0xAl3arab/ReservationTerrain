import { useState } from "react";

function ClientSignupPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        nom: "",
        prenom: "",
        numTele: "",
    });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8080/auth/client/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setResult({ error: "Erreur réseau" });
        }
    };

    return (
        <div>
            <h2>Client Signup</h2>
            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} />
                <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} />
                <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} />
                <input name="numTele" placeholder="Téléphone" value={form.numTele} onChange={handleChange} />
                <button type="submit">S'inscrire</button>
            </form>

            <pre>{result && JSON.stringify(result, null, 2)}</pre>
        </div>
    );
}

export default ClientSignupPage;
