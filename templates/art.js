/* 本檔案為網頁設計師撰寫,非人請勿修改,以免未來維護困難,如果需修改可請找網頁設計師討論,感謝~ */
$(document).ready(function () {

});



/* tab切換課區 開始 */
function show_lesson(arg1, arg2) {
	// 取得當前 active 的冊 (book) 按鈕
	const $currentBook = $('.book_list a.active');

	// 取得即將顯示的冊 (book) 按鈕
	const $nextBook = $(arg1);

	// 取得當前 active 的課 (lesson) 列表
	const $currentLessonList = $('.lesson_list ul.active');

	// 取得即將顯示的課 (lesson) 列表
	const $nextLessonList = $('.lesson_list ul.' + arg2);

	// 只有在點擊不同的冊時才執行切換和動畫
	if (!$nextBook.hasClass('active')) {
		// 1. 切換冊 (book) 按鈕的 active 狀態
		$currentBook.removeClass('active');
		$nextBook.addClass('active');

		// 2. 切換課 (lesson) 列表
		// 隱藏目前的列表並將其移除 active 類別
		$currentLessonList.fadeOut(200, function () {
			$(this).removeClass('active');

			// 顯示新的列表並添加 active 類別（使用 fadeIn 實現淡入效果）
			$nextLessonList.addClass('active').fadeIn(400); // 400ms 淡入
		});
	}
}
/* tab切換課區 結束 */


/* tab課區預設化 開始 */
$(document).ready(function () {
	$('.lesson_list ul:not(.active) li').removeClass('active');
});
/* tab課區預設化 結束 */


/* 字級大小設定 開始 */
function set_text_size(size) {
	const sizeMap = {
		's': '16px',
		'm': '18px',
		'l': '22px'
	};

	const sizeMap_2 = {
		's': '30px',
		'm': '40px',
		'l': '50px'
	};

	const sizeMap_3 = {
		's': '16px',
		'm': '20px',
		'l': '26px'
	};

	const sizeMap_4 = {
		's': '15px',
		'm': '17px',
		'l': '20px'
	};

	//
	$('.subhtml').css('font-size', sizeMap[size]);
	//
	$('.subhtml .art_cke_h3_01').css('font-size', sizeMap_2[size]);
	//
	$('.box_exam .title').css('font-size', sizeMap_3[size]);

	$('.box_exam .q a').css('font-size', sizeMap_4[size]);
	$('.box_ans .title').css('font-size', sizeMap_4[size]);
	$('.box_ans p').css('font-size', sizeMap_4[size]);

	$('.set_text_size a').removeClass('active');
	$('.set_text_size a.' + size).addClass('active');
}
/* 字級大小設定 結束 */



/* 考題工作 開始 */
$(document).ready(function () {
	let currentIdx = 0;
	let correctCount = 0;
	let wrongCount = 0;
	let userSelections = new Array(quizData.length).fill(null); // 紀錄每題作答狀況

	// 初始化：隱藏結果頁與解析
	$('.page_02, .box_ans').hide();
	updateNumbers();

	// 點擊開始答題
	window.btn_start = function () {
		$('.page_01').removeClass('blur');
		$('.page_01').show();
		$('.btn_start').fadeOut();
	};

	// 渲染題目
	function renderQuestion(index) {
		const data = quizData[index];
		const $examBox = $('.box_exam');

		// 清空舊內容
		$examBox.empty();

		// 插入題目
		$examBox.append(`<p class="title">${data.title}</p>`);

		// 插入選項
		data.options.forEach((opt, i) => {
			let statusClass = "";
			// 如果這題已經做過，顯示當時的結果
			if (userSelections[index] !== null) {
				if (i === data.answer) statusClass = "incorrect"; // 這裡的 css class 配合你 HTML 裡的正確樣式
				else if (i === userSelections[index] && i !== data.answer) statusClass = "wrong";
			}

			$examBox.append(`
                <p class="q ${statusClass}">
                    <a href="javascript:void(0);" onclick="user_select(this, ${i})">${opt}</a>
                    <span class="icon_none"></span>
                </p>
            `);
		});

		// 處理解析與按鈕狀態
		if (userSelections[index] !== null) {
			showAnalysis(index);
		} else {
			$('.box_ans').hide();
		}

		updateNavButtons();
		updateNumbers();
	}

	// 處理選擇答案
	window.user_select = function (el, selectIdx) {
		// 若該題已作答則不重複觸發
		if (userSelections[currentIdx] !== null) return;

		const correctIdx = quizData[currentIdx].answer;
		userSelections[currentIdx] = selectIdx;

		// 判斷對錯
		if (selectIdx === correctIdx) {
			$(el).parent().addClass('incorrect'); // 假設 incorrect 是正確的綠色
			correctCount++;
		} else {
			$(el).parent().addClass('wrong'); // 錯誤紅色
			// 標示出正確答案
			$('.box_exam .q').eq(correctIdx).addClass('incorrect');
			wrongCount++;
		}

		showAnalysis(currentIdx);

		//選完答案後，立刻檢查並解鎖「下一個」按鈕
		updateNavButtons();
	};

	// 顯示解析
	function showAnalysis(index) {
		$('.box_ans').fadeIn().find('p').text(quizData[index].explanation);
	}

	// 更新題號數字
	function updateNumbers() {
		$('.num_current').text(currentIdx + 1);
		$('.num_total').text(quizData.length);
	}

	// 更新導覽按鈕狀態
	function updateNavButtons() {
		// 上一題按鈕
		if (currentIdx === 0) {
			$('.page_prev').addClass('distable').prop('disabled', true);
		} else {
			$('.page_prev').removeClass('distable').prop('disabled', false);
		}

		// 下一題按鈕
		const isAnswered = userSelections[currentIdx] !== null;

		if (currentIdx === quizData.length - 1) {
			$('.page_next').text('查看結果');
		} else {
			$('.page_next').text('下一個');
		}

		// 如果沒作答，就鎖住按鈕
		if (!isAnswered) {
			$('.page_next').addClass('distable').prop('disabled', true);
		} else {
			$('.page_next').removeClass('distable').prop('disabled', false);
		}
	}

	// 下一題邏輯
	window.page_next = function () {
		if (currentIdx < quizData.length - 1) {
			currentIdx++;
			renderQuestion(currentIdx);
		} else {
			showFinalResult();
		}
	};

	// 上一題邏輯
	window.page_prev = function () {
		if (currentIdx > 0) {
			currentIdx--;
			renderQuestion(currentIdx);
		}
	};

	// 顯示最終結果
	function showFinalResult() {
		$('.page_01').hide();
		$('.page_02').fadeIn();
		$('.box_score .incorrect span').text(correctCount);
		$('.box_score .wrong span').text(wrongCount);
	}

	//
	renderQuestion(currentIdx);
});
/* 考題工作 結束 */