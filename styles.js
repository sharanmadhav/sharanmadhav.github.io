const character = document.getElementById('character');
        const catchMessage = document.getElementById('catchMessage');
        const catchCounter = document.getElementById('catchCounter');
        let catchCount = 0;
        let canBeCaught = true;
        let randomString;
        const uniqueStrUrl = `https://portfoli-f671f-default-rtdb.firebaseio.com/uniqueStrUrl.json`;
        if(localStorage.getItem("SDRNDSTR") != null){
            randomString = localStorage.getItem("SDRNDSTR");
        }
        else{
            randomString = Math.random().toString(36).substring(2, 10);
            fetch(uniqueStrUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uniqueStr: randomString })
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                console.log('randomString posted successfully:', randomString);
            })
            .catch(error => console.error('Error posting randomString:', error));
            localStorage.setItem("SDRNDSTR",randomString);
        }
        const apiUrl = `https://portfoli-f671f-default-rtdb.firebaseio.com/catchCount/${randomString}.json`;
        function updateMessagePosition() {
            const charRect = character.getBoundingClientRect();
            catchMessage.style.top = `${charRect.top - 30}px`;
            catchMessage.style.left = `${charRect.left + charRect.width / 2 - catchMessage.offsetWidth / 2}px`;
        }
        window.addEventListener('load', () => {
            updateMessagePosition();
            catchMessage.classList.add('show');
            setTimeout(() => {
                catchMessage.classList.remove('show');
            }, 2000);
        });
        function repositionCharacter() {
            const maxX = window.innerWidth - character.offsetWidth;
            const maxY = window.innerHeight - character.offsetHeight;
            const newX = Math.random() * maxX;
            const newY = Math.random() * maxY;
            character.style.left = `${newX}px`;
            character.style.top = `${newY}px`;
            character.classList.remove('run-away');
            canBeCaught = true;
            updateMessagePosition();
        }
        setInterval(() => {
            repositionCharacter();
        }, 800);

        character.addEventListener('click', () => {
            if (canBeCaught) {
                catchCount++;
                catchCounter.textContent = `Catches: ${catchCount}`;
                character.classList.add('run-away');
                canBeCaught = false;

                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ catchCount: catchCount })
                })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    console.log('Catch count posted successfully:', catchCount);
                })
                .catch(error => console.error('Error posting catch count:', error));

                setTimeout(() => {
                    repositionCharacter();
                }, 200);
            }
        });
