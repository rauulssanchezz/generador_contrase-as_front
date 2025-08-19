// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
	// Función para copiar texto al portapapeles
	function copiarAlPortapapeles(texto) {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(texto);
		} else {
			// Fallback para navegadores antiguos
			const tempInput = document.createElement('input');
			tempInput.value = texto;
			document.body.appendChild(tempInput);
			tempInput.select();
			document.execCommand('copy');
			document.body.removeChild(tempInput);
		}
	}
	// Password Generator
	const generatorSection = document.querySelectorAll('.bg-white.rounded-lg.shadow-md')[0];
	const generateBtn = generatorSection.querySelector('button');
	const generatedPasswordInput = generatorSection.querySelector('input[placeholder="Password will appear here"]');
	const generatedCopyBtn = generatorSection.querySelector('div[data-icon="Copy"]');
	if (generatedCopyBtn && generatedPasswordInput) {
		generatedCopyBtn.style.cursor = 'pointer';
		generatedCopyBtn.title = 'Copiar al portapapeles';
		generatedCopyBtn.addEventListener('click', () => {
			copiarAlPortapapeles(generatedPasswordInput.value);
		});
	}

		if (generateBtn && complexitySelect && generatedPasswordInput) {
			generateBtn.addEventListener('click', async () => {
				const complexity = complexitySelect.value;
				// Animación de cargando
				generatedPasswordInput.value = 'Cargando';
				let loadingInterval = setInterval(() => {
					dots = (dots + 1) % 4;
					generatedPasswordInput.value = 'Cargando' + '.'.repeat(dots);
				}, 400);
				try {
					const res = await fetch(`https://generador-contrase-as.onrender.com/password/generate?complexity=${encodeURIComponent(complexity)}`);
					const data = await res.json();
					clearInterval(loadingInterval);
					// La API puede devolver la contraseña como data.password o directamente como string
					if (typeof data === 'string') {
						generatedPasswordInput.value = data;
					} else if (data && data.password) {
						generatedPasswordInput.value = data.password;
					} else {
						generatedPasswordInput.value = '';
					}
				} catch (e) {
					clearInterval(loadingInterval);
					generatedPasswordInput.value = 'Error';
				}
			});
		}

	// Password Hasher
	const hasherSection = document.querySelectorAll('.bg-white.rounded-lg.shadow-md')[1];
	const hashBtn = hasherSection.querySelector('button');
	const passwordToHashInput = hasherSection.querySelector('input[placeholder="Enter password"]');
	const hashedPasswordInput = hasherSection.querySelector('input[placeholder="Hashed password will appear here"]');
	// Copiar hash
	const hashedCopyBtn = hasherSection.querySelector('div[data-icon="Copy"]');
	if (hashedCopyBtn && hashedPasswordInput) {
		hashedCopyBtn.style.cursor = 'pointer';
		hashedCopyBtn.title = 'Copiar al portapapeles';
		hashedCopyBtn.addEventListener('click', () => {
			copiarAlPortapapeles(hashedPasswordInput.value);
		});
	}
		if (hashBtn && passwordToHashInput && hashedPasswordInput) {
			hashBtn.addEventListener('click', async () => {
				const password = passwordToHashInput.value;
				// Animación de cargando
				let dots = 0;
				hashedPasswordInput.value = 'Cargando';
				let loadingInterval = setInterval(() => {
					dots = (dots + 1) % 4;
					hashedPasswordInput.value = 'Cargando' + '.'.repeat(dots);
				}, 400);
				try {
					// Ahora la API espera el password en el body (POST)
					const res = await fetch('https://generador-contrase-as.onrender.com/password/hash', {
						method: 'POST',
						body: password
					});
					const data = await res.json();
					clearInterval(loadingInterval);
					if (typeof data === 'string') {
						hashedPasswordInput.value = data;
					} else if (data.hashed_password) {
						hashedPasswordInput.value = data.hashed_password;
					} else if (data.detail && Array.isArray(data.detail)) {
						// Mostrar el mensaje de error de la API y log completo para depuración
						hashedPasswordInput.value = data.detail.map(e => `${e.loc ? e.loc.join('.') + ': ' : ''}${e.msg}`).join('; ');
					} else {
						hashedPasswordInput.value = 'Error';
					}
				} catch (e) {
					clearInterval(loadingInterval);
					hashedPasswordInput.value = 'Error';
				}
			});
		}

	// Password Checker
	const checkerSection = document.querySelectorAll('.bg-white.rounded-lg.shadow-md')[2];
	const checkBtn = checkerSection.querySelector('button');
	const passwordCheckInput = checkerSection.querySelector('input[placeholder="Enter password"]');
	const hashedPasswordCheckInput = checkerSection.querySelector('input[placeholder="Enter hashed password"]');
	// Copiar hash checker (opcional, si quieres copiar el input de hash checker)
	const checkerCopyBtn = checkerSection.querySelector('div[data-icon="Copy"]');
	if (checkerCopyBtn && hashedPasswordCheckInput) {
		checkerCopyBtn.title = 'Copiar al portapapeles';
		checkerCopyBtn.addEventListener('click', () => {
			copiarAlPortapapeles(hashedPasswordCheckInput.value);
		});
	}
		// Buscar el párrafo de resultado por su texto inicial
		let resultText = null;
		const paragraphs = checkerSection.querySelectorAll('p');
		paragraphs.forEach(p => {
			if (p.textContent && p.textContent.trim().startsWith('Result:')) {
				resultText = p;
			}
		});

		if (checkBtn && passwordCheckInput && hashedPasswordCheckInput && resultText) {
			checkBtn.addEventListener('click', async () => {
				const password = passwordCheckInput.value;
				const hashed_password = hashedPasswordCheckInput.value;
				// Animación de cargando
				let dots = 0;
				resultText.textContent = 'Cargando';
				resultText.style.color = '';
				resultText.style.fontWeight = '';
				let loadingInterval = setInterval(() => {
					dots = (dots + 1) % 4;
					resultText.textContent = 'Cargando' + '.'.repeat(dots);
				}, 400);
				try {
					const res = await fetch('https://generador-contrase-as.onrender.com/password/check', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ password, hashed_password })
					});
					const data = await res.json();
					clearInterval(loadingInterval);
					if (typeof data.match === 'boolean') {
						const isTrue = data.match === true;
						resultText.textContent = 'Result: ' + (isTrue ? 'TRUE' : 'FALSE');
						resultText.style.color = isTrue ? 'green' : 'red';
						resultText.style.fontWeight = 'bold';
					} else if (typeof data === 'boolean') {
						const isTrue = data === true;
						resultText.textContent = 'Result: ' + (isTrue ? 'TRUE' : 'FALSE');
						resultText.style.color = isTrue ? 'green' : 'red';
						resultText.style.fontWeight = 'bold';
					} else {
						resultText.textContent = 'Result: Error';
						resultText.style.color = '';
						resultText.style.fontWeight = '';
					}
				} catch (e) {
					clearInterval(loadingInterval);
					resultText.textContent = 'Result: Error';
				}
			});
		}
});
