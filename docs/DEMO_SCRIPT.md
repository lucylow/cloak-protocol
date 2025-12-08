# 3-Minute Demo Video Script: Cloak Protocol

**Objective**: Showcase a seamless, end-to-end private trade on the Psy testnet, highlighting ZK proofs and on-chain settlement.

**(0:00-0:20) Introduction & Problem**

*   **Visual**: Title slide: "Cloak Protocol: Private Trading for Real-World Assets."
*   **Voiceover**: "Trading tokenized real-world assets on-chain is the future of finance. But there's a problem: public blockchains expose every trade, every balance, and every strategy. Institutions can't operate in a transparent fishbowl. Cloak Protocol solves this with zero-knowledge privacy on the Psy network."

**(0:20-1:00) Launch DApp & Connect Wallet**

*   **Action**: Click "Launch DApp" button. The clean, professional dashboard loads.
*   **Voiceover**: "This is the Cloak Protocol dashboard. It's a fully-featured DEX, but with a critical difference: everything is private by default."
*   **Action**: Click "Connect Wallet." A prompt appears to connect a Psy SDKey-based wallet.
*   **Voiceover**: "We connect our wallet, which manages our programmable identity and generates proofs locally, so our private keys never leave the device."

**(1:00-2:00) Create a Private Trade & Generate Proof**

*   **Action**: Navigate to the "Trade" page. Select an RWA token (e.g., RWA-CREDIT) and create a buy order.
*   **Voiceover**: "Let's place a trade. We'll buy 100 units of a tokenized credit asset. Notice that our balances are shielded."
*   **Action**: Click "Submit Private Trade." A "Generating Proof" modal appears with a progress bar.
*   **Voiceover**: "Now, the magic happens. Our client is generating a zero-knowledge proof—a cryptographic guarantee that we have the funds for this trade, without revealing who we are or how much we have. This proof contains over 1.2 million constraints, but it's generated in just a few seconds."

**(2:00-2:45) On-Chain Verification & Settlement**

*   **Action**: The proof status changes to "Verifying on Psy Testnet." A transaction hash appears.
*   **Voiceover**: "The proof is now being submitted to our verifier smart contract on the Psy testnet. Thanks to Psy's high-performance architecture, verification takes less than 50 milliseconds."
*   **Action**: The trade status updates to "Filled." The new position appears in the shielded portfolio.
*   **Voiceover**: "And it's done. The trade is settled on-chain, our position is updated, and our privacy remains intact. No one on the public network can see the details of our trade."

**(2:45-3:00) Conclusion**

*   **Visual**: Final slide with the Cloak Protocol logo and tagline.
*   **Voiceover**: "This is Cloak Protocol. Institutional-grade privacy, powered by zero-knowledge proofs and the scalability of Psy. The future of private finance is here. Thank you."
