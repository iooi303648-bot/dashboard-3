// Card news slider and export system for the Icecream AI digital learning material dashboard guide.

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('slider-track');
    const cards = document.querySelectorAll('.card-slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('slider-dots');

    if (track && cards.length > 0 && prevBtn && nextBtn && dotsContainer) {
        let currentIndex = 0;
        const totalCards = cards.length;

        cards.forEach((card, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.type = 'button';
            dot.setAttribute('aria-label', `${index + 1}번 카드로 이동`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.slider-dot');

        function updateControls() {
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalCards - 1;

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            if (index < 0 || index >= totalCards) return;
            currentIndex = index;
            track.style.transform = `translateX(${-currentIndex * 100}%)`;
            updateControls();
        }

        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        let startX = 0;

        track.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', (event) => {
            const diffX = startX - event.changedTouches[0].clientX;
            if (Math.abs(diffX) <= 50) return;
            goToSlide(currentIndex + (diffX > 0 ? 1 : -1));
        }, { passive: true });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') goToSlide(currentIndex - 1);
            if (event.key === 'ArrowRight') goToSlide(currentIndex + 1);
        });

        updateControls();
    }

    const downloadAllBtn = document.getElementById('download-all-btn');

    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', async () => {
            if (!window.html2canvas) {
                alert('카드 저장 기능을 불러오지 못했어요. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.');
                return;
            }

            downloadAllBtn.disabled = true;
            const originalText = downloadAllBtn.innerHTML;
            const exportCards = document.querySelectorAll('.card-slide');

            for (let i = 0; i < exportCards.length; i += 1) {
                downloadAllBtn.innerHTML = `<span class="btn-icon">⏳</span> 저장 중 (${i + 1}/${exportCards.length})`;

                try {
                    const canvas = await html2canvas(exportCards[i], {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: null,
                        logging: false
                    });

                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/png');
                    link.download = `아이스크림_AI_디지털_교육자료_대시보드_안내_카드_${String(i + 1).padStart(2, '0')}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    await new Promise((resolve) => setTimeout(resolve, 800));
                } catch (error) {
                    console.error(`카드 ${i + 1} 저장 중 오류가 발생했습니다.`, error);
                }
            }

            downloadAllBtn.innerHTML = '<span class="btn-icon">✅</span> 다운로드 완료!';
            downloadAllBtn.disabled = false;

            setTimeout(() => {
                downloadAllBtn.innerHTML = originalText;
            }, 3000);
        });
    }
});
