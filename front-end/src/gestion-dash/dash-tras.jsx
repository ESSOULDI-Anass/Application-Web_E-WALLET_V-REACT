import { useState } from "react";
import { finduserbyaccount } from "../bd/database";
import { findbeneficiarieByid } from "../bd/database";

export default function DashTras({authUser,settransferePopup}) {
    const [beneficiaryId,setbeneficiaryId] = useState("");
    
    const [sourceCard, setSourceCard] = useState("");
    const [amount,setamount] = useState(0);

    function checkUser(numcompte) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const beneficiary = finduserbyaccount(numcompte);
            if (beneficiary) {
              resolve(beneficiary); 
            } else {
              reject("Destinataire introuvable"); 
            }
          }, 2000);
        });
      }
      
      
      function checkSolde(expediteur, amount) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (expediteur.wallet.balance > amount) {
              resolve("Solde suffisant"); 
            } else {
              reject("Solde insuffisant"); 
            }
          }, 3000);
        });
      }
      
      
      function updateSolde(expediteur, destinataire, amount) {
        return new Promise((resolve) => {
          setTimeout(() => {
            expediteur.wallet.balance -= amount;
            destinataire.wallet.balance += amount;
            resolve("Mise à jour du solde effectuée"); 
          }, 200);
        });
      }
      
      
      function addtransactions(expediteur, destinataire, amount) {
        return new Promise((resolve) => {
          setTimeout(() => {
            
            const credit = {
              id: Date.now(),
              type: "credit",
              amount: amount,
              date: new Date().toLocaleString(),
              from: expediteur.name,
            };
      
            
            const debit = {
              id: Date.now(),
              type: "debit",
              amount: amount,
              date: new Date().toLocaleString(),
              to: destinataire.name,
            };
      
            expediteur.wallet.transactions.push(debit);
            destinataire.wallet.transactions.push(credit);
      
            resolve("Transaction ajoutée avec succès"); 
          }, 3000);
        });
      }
      async function transfer(expediteur, numcompte, amount) {
        try {
          const destinataire = await checkUser(numcompte);
          const soldeMessage = await checkSolde(expediteur, amount);
          const updateMessage = await updateSolde(expediteur, destinataire, amount);
          const addTransactionMessage = await addtransactions(expediteur, destinataire, amount);
      
          alert("Virement effectué avec succès !");
          settransferePopup(false);
      
        } catch (error) {
          alert(error);
        }
      }      

function handleTransfer(e) {
    e.preventDefault();
    const beneficiaryAccount = findbeneficiarieByid(authUser.id, beneficiaryId);
     console.log(beneficiaryAccount);
    if (!beneficiaryAccount) {
        alert("Bénéficiaire invalide");
        return;
      }
    
      transfer(authUser, beneficiaryAccount.account, amount);
    }
  
    return(
        <>
            <div className="popup-overlay" id="transferPopup">
            <div className="popup-content">
                <div className="popup-header">
                <h2>Effectuer un transfert</h2>
                <button className="btn-close" id="closeTransferBtn" 
                
                onClick={() => settransferePopup(false)}
                type="button" >
                    <i className="fas fa-times"></i>
                </button>
                </div>

                <div className="popup-body">
                <form id="transferForm" className="transfer-form" onSubmit={handleTransfer}>
                    <div className="form-group">
                    <label htmlFor="beneficiary">
                        <i className="fas fa-user"></i> Bénéficiaire
                    </label>
                    <select id="beneficiary" name="beneficiary" 
                        onChange={(e) =>
                            setbeneficiaryId(e.target.value )}
                    
                    required>
                        <option value="">Choisir un bénéficiaire</option>
                        {authUser.wallet.beneficiaries.map((ben) => (
                        
                        
                        <option value={ben.id} key={ben.id} >{ben.name}</option>
                    ))}
                        
                    </select>
                    </div>

                    <div className="form-group">
                    <label for="sourceCard">
                        <i className="fas fa-credit-card"></i> Depuis ma carte
                    </label>
                    <select id="sourceCard" name="sourceCard" 
                    
                    onChange={(e) =>
                        setSourceCard(e.target.value )
                      }
                    required>
                        <option value="">Choisir une carte</option>
                      {authUser.wallet.cards.map((card) => (
                        
                    
                        <option value={card.numcards} key={card.numcards} >{card.numcards}{card.type}</option>
                    ))}
                       
                       
                        
                    </select>
                    </div>

                    <div className="form-group">
                    <label for="amount">
                        <i></i> Montant
                    </label>
                    <div className="amount-input">
                        <input type="number" id="amount" name="amount" min="1" step="0.01" placeholder="0.00" 
                        
                          
                        onChange={(e) => setamount(Number(e.target.value))}
                        required/>
                        <span className="currency">MAD</span>
                    </div>
                    </div>

                    <div className="form-options">
                    <div className="checkbox-group">
                        <input type="checkbox" id="saveBeneficiary" name="saveBeneficiary"/>
                        <label for="saveBeneficiary">Enregistrer ce bénéficiaire</label>
                    </div>
                    
                    <div className="checkbox-group">
                        <input type="checkbox" id="instantTransfer" name="instantTransfer"/>
                        <label for="instantTransfer">Transfert instantané <span className="fee-badge">+13.4 MAD</span></label>
                    </div>
                    </div>
                    
                    <div className="form-actions">
                    <button type="button" className="btn btn-secondary" 
                    
                    onClick={() => settransferePopup(false)}
                    id="cancelTransferBtn">
                        Annuler
                    </button>
                    <button type="submit" className="btn btn-primary" id="submitTransferBtn">
                        <i className="fas fa-paper-plane"></i> Transférer
                    </button>
                    </div>
                </form>
                </div>
            </div>
            </div>
        </>
    );
}