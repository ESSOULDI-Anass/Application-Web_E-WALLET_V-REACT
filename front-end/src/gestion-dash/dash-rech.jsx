import { useState  } from "react";

export default function DashRech({authUser,settopupPopup}) {
    const [numcards,setnumcards] = useState("");
    const [amount,setamount] = useState("");
    function validateAmount(amount) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (!amount || isNaN(amount)) {
              reject("Montant invalide ou vide.");
            } else if (amount <= 0) {
              reject("Le montant doit être supérieur à zéro.");
            } else if (amount < 10) {
              reject("Le montant minimum est de 10 MAD.");
            } else if (amount > 10000) {
              reject("Le montant maximum est de 10 000 MAD.");
            } else {
              resolve(amount);
            }
          }, 500);
        });
      }

      function validateCard(numcards) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const card = authUser.wallet.cards.find((c) => c.numcards === numcards);
      
            if (!card) {
              reject("Moyen de paiement introuvable.");
              return;
            }
      
            // Vérifier si la carte est expirée (format MM/YY)
            const [year,month,day] = card.expiry.split("-");
            const expiryDate = new Date(year, month - 1, day);
            const today = new Date();
      
            if (expiryDate < today) {
              reject(`La carte **** ${card.numcards} est expirée.`);
              return;
            }
      
            resolve(card);
          }, 500);
        });
      }
      function processTopup(card, amount) {
        return new Promise((resolve) => {
          setTimeout(() => {
            
              authUser.wallet.balance += amount;
              resolve({ card, amount });
           
          }, 1000);
        });
      }

      function saveTopupTransaction(card, amount, status) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const transaction = {
              id: Date.now(),
              type: "RECHARGE",
              amount: amount,
              date: new Date().toLocaleString(),
              from: `Carte ****` +card.numcards,
              status: status, 
            };
      
            authUser.wallet.transactions.push(transaction);
            resolve(transaction);
          }, 500);
        });
      }      

      async function topup(numcards, amount) {
        try{
        const validAmount= await validateAmount(amount);
        
        const card= await validateCard(numcards);
       
        const topupResult= await processTopup(card, amount);
        
        const transaction= await saveTopupTransaction(card, amount, "success");
        setrechPopup(false);
        alert(` Rechargement de ${amount} MAD effectué avec succès !`);
        }catch(error){
            alert(error);
        }

        }
        function topupForm(e){
            e.preventDefault();
           
            topup(numcards, amount);
          }






    return (
        <div className="popup-overlay" id="topupPopup">
            <div className="popup-content">
                        <div className="popup-header">
                        <h2>Recharger mon portefeuille</h2>
                        <button className="btn-close" id="closeTopupBtn" type="button"
                        
                        onClick={() => settopupPopup(false)}

                        >
                            <i className="fas fa-times"></i>
                        </button>
                        </div>
                        <div className="popup-body">
                        <form id="topupForm" className="transfer-form" onSubmit={topupForm}>
                            <div className="form-group">
                            <label htmlFor="topupCard">
                                <i className="fas fa-credit-card"></i> Carte source
                            </label>
                            <select id="topupCard" name="topupCard" 
                            
                            onChange={(e) => setnumcards(e.target.value)}
                            required>
                                <option value="" >Sélectionner une carte</option>
                                {authUser.wallet.cards.map((card) => (
                                
                                <option value={card.numcards} key={card.numcards}>**** {card.numcards} {card.type}</option>
                                ))}
                            </select>
                            </div>
                            <div className="form-group">
                            <label htmlFor="topupAmount">Montant</label>
                            <div className="amount-input">
                                <input type="number" id="topupAmount" name="topupAmount"
                                    min="10" step="0.01" placeholder="0.00" 
                                onChange={(e) => setamount(e.target.value)}    
                                    
                                required/>
                                <span className="currency">MAD</span>
                            </div>
                            </div>
                            
                            <div className="form-actions">
                            <button type="button" className="btn btn-secondary" id="cancelTopupBtn"
                            
                            onClick={() => settopupPopup(false)}
                            >Annuler</button>
                            <button type="submit" className="btn btn-primary">
                                <i className="fas fa-plus-circle"></i> Recharger
                            </button>
                            </div>
                        </form>
                        </div>
            </div>
        </div> 

    );
}