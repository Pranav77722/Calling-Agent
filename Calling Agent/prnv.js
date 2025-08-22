// --- CONFIGURATION ---
    // IMPORTANT: In a real application, you should not expose the API key on the client-side.
    // This should be handled by a backend server that makes the API call on behalf of the client.
    const API_KEY = ""; // Your VAPI API key
    const AGENT_ID = ""; // Your VAPI Agent ID
    const PHONE_NUMBER_ID = ""; // Your VAPI Phone Number ID

    // --- DOM ELEMENT REFERENCES ---
    const phoneInput = document.getElementById("phone");
    const callButton = document.getElementById("callButton");
    const buttonText = document.getElementById("buttonText");
    const spinner = document.getElementById("spinner");
    const statusEl = document.getElementById("status");

    /**
     * Sets the UI to a loading state.
     * Disables the button and shows a spinner.
     */
    function setLoadingState(isLoading) {
      callButton.disabled = isLoading;
      if (isLoading) {
        buttonText.textContent = "Calling...";
        spinner.classList.remove("hidden");
      } else {
        buttonText.textContent = "Call Now";
        spinner.classList.add("hidden");
      }
    }

    /**
     * Displays a status message to the user.
     * @param {string} message - The message to display.
     * @param {'success' | 'error' | 'info'} type - The type of message, for styling.
     */
    function showStatus(message, type = 'info') {
      statusEl.textContent = message;
      statusEl.classList.remove('text-green-500', 'text-red-500', 'text-blue-400');
      switch (type) {
        case 'success':
          statusEl.classList.add('text-green-500');
          break;
        case 'error':
          statusEl.classList.add('text-red-500');
          break;
        case 'info':
          statusEl.classList.add('text-blue-400');
          break;
      }
    }

    /**
     * Initiates a call using the VAPI.ai API.
     */
    async function makeCall() {
      const phoneNumber = phoneInput.value.trim();

      // Basic validation
      if (!phoneNumber) {
        showStatus("❌ Please enter a phone number.", 'error');
        return;
      }

      setLoadingState(true);
      showStatus("⏳ Connecting call...", 'info');

      try {
        // Make the API request to VAPI
        const response = await fetch("https://api.vapi.ai/call/phone", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            phoneNumberId: PHONE_NUMBER_ID, // This specifies the caller ID.
            assistantId: AGENT_ID,
            customer: { number: phoneNumber }
          })
        });

        const data = await response.json();

        // Check if the API call was successful
        if (response.ok) {
          showStatus("✅ Call initiated successfully!", 'success');
          console.log("Call details:", data);
        } else {
          // Display a more specific error from the API if available
          const errorMessage = data.message || "An unknown error occurred.";
          showStatus(`❌ Error: ${errorMessage}`, 'error');
          console.error("API Error:", data);
        }
      } catch (error) {
        // Handle network or other unexpected errors
        showStatus("⚠️ Network error. Please check your connection.", 'error');
        console.error("Fetch Error:", error);
      } finally {
        // Always reset the button state
        setLoadingState(false);
      }
    }
    
    // Allow pressing Enter to make a call
    phoneInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            makeCall();
        }
    });