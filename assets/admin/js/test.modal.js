
//create Modal
function createModalHtml(){
    debugger;
    let html = `
             <div class="option-board option-1"><!--<div>--no data max-- data-max="1"</div>-->
                <!--<div>1 single click anyway, 0 when no dependent is on it</div>-->
                <span>Choose your size</span>
                <p>Required Field - Choose 1.</p>
                <div class="option-list">
                    <div class="radio">
                        <input type="radio" id="radio1" data-option="small" name="radio" value="5.50">
                        <label for="radio1">
                            <div class="checker"></div>
                            Small
                        </label>
                    </div>
                    <div class="radio">
                        <input type="radio" id="radio2" data-option="medium" name="radio" value="15.98">
                        <label for="radio2">
                            <div class="checker"></div>
                            Medium
                        </label>
                    </div>
                    <div class="radio">
                        <input type="radio" id="radio3" data-option="large" name="radio" value="25">
                        <label for="radio3">
                            <div class="checker"></div>
                            Large
                        </label>
                    </div>
                </div>

                <div class="option-list">
                    <div class="radio">
                        <input type="radio" data-option="small-pan" id="radio4" name="radio" value="150">
                        <label for="radio4">
                            <div class="checker"></div>
                            Small Pan
                        </label>
                    </div>
                    <div class="radio">
                        <input type="radio" id="radio5" data-option="medium-pan" name="radio" value="200">
                        <label for="radio5">
                            <div class="checker"></div>
                            Medium Pan
                        </label>
                    </div>
                    <div class="radio">
                        <input type="radio" id="radio6" data-option="large-pan" name="radio" value="250">
                        <label for="radio6">
                            <div class="checker"></div>
                            Large Pan
                        </label>
                    </div>
                </div>
            </div>
            <!--<div>end of checkbox main options board</div>-->
            <div style="margin: 10px;"></div>
            <div class="option-board  option-2" data-max="2">
                <span>Would you like to add extras?</span>
                <p>Optional - Choose only 2.</p>
                <div class="option-list option-horizontal">
                    <div class="checkbox">
                        <input type="checkbox" data-singleproduct="false" disabled="disabled" id="check1" data-option="small" name="check" value="5.50">
                        <label for="check1">
                            <div class="checker"></div>
                            Small
                        </label>
                        <div class="inner-option-board inner-option-1">
                            <span>Choose your size</span>
                            <p>Required Field - Choose 1.</p>
                            <div class="option-list">
                                <div class="radio">
                                    <input type="radio" id="inner-radio1" data-option="small" name="check1" value="5.50">
                                    <label for="inner-radio1">
                                        <div class="checker"></div>
                                        Small
                                    </label>
                                </div>
                                <div class="radio">
                                    <input type="radio" id="inner-radio2" data-option="medium" name="check1" value="15.98">
                                    <label for="inner-radio2">
                                        <div class="checker"></div>
                                        Medium
                                    </label>
                                </div>
                                <div class="radio">
                                    <input type="radio" id="inner-radio3" data-option="large" name="check1" value="25">
                                    <label for="inner-radio3">
                                        <div class="checker"></div>
                                        Large
                                    </label>
                                </div>
                            </div>

                            <div class="option-list">
                                <div class="radio">
                                    <input type="radio" data-option="small-pan" id="inner-radio4" name="check1" value="150">
                                    <label for="inner-radio4">
                                        <div class="checker"></div>
                                        Small Pan
                                    </label>
                                </div>
                                <div class="radio">
                                    <input type="radio" id="inner-radio5" data-option="medium-pan" name="check1" value="200">
                                    <label for="inner-radio5">
                                        <div class="checker"></div>
                                        Medium Pan
                                    </label>
                                </div>
                                <div class="radio">
                                    <input type="radio" id="inner-radio6" data-option="large-pan" name="check1" value="250">
                                    <label for="inner-radio6">
                                        <div class="checker"></div>
                                        Large Pan
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="checkbox">
                        <input type="checkbox" data-singleproduct="false" disabled="disabled" id="check2" data-option="medium" name="check" value="15.98">
                        <label for="check2">
                            <div class="checker"></div>
                            Medium
                        </label>
                        <div class="inner-option-board inner-option-1">
                            <span>Choose your size</span>
                            <p>Required Field - Choose 1.</p>
                            <div class="option-list">
                                <div class="radio">
                                    <input type="radio" id="inner-radio7" data-option="small" name="check2" value="5.50">
                                    <label for="inner-radio7">
                                        <div class="checker"></div>
                                        Small
                                    </label>
                                </div>
                                <div class="radio">
                                    <input type="radio" id="inner-radio8" data-option="medium" name="check2" value="15.98">
                                    <label for="inner-radio8">
                                        <div class="checker"></div>
                                        Medium
                                    </label>
                                </div>
                                <div class="radio">
                                    <input type="radio" id="inner-radio9" data-option="large" name="check2" value="25">
                                    <label for="inner-radio9">
                                        <div class="checker"></div>
                                        Large
                                    </label>
                                </div>
                            </div>

                            <div class="option-list">
                                <div class="radio">
                                    <input type="radio" data-option="small-pan" id="inner-radio10" name="check2" value="150">
                                    <label for="inner-radio10">
                                        <div class="checker"></div>
                                        Small Pan
                                    </label>
                                </div>
                                <div class="radio">
                                    <input type="radio" id="inner-radio11" data-option="medium-pan" name="check2" value="200">
                                    <label for="inner-radio11">
                                        <div class="checker"></div>
                                        Medium Pan
                                    </label>
                                </div>
                                <div class="radio">
                                    <input type="radio" id="inner-radio12" data-option="large-pan" name="check2" value="250">
                                    <label for="inner-radio12">
                                        <div class="checker"></div>
                                        Large Pan
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="checkbox">
                        <input type="checkbox" data-singleproduct="false" disabled="disabled" id="check3" data-option="large" name="check" value="25">
                        <label for="check3">
                            <div class="checker"></div>
                            Large
                        </label>
                    </div>
                </div>
            </div>
            <!--<div>end of checkbox extra options board</div>-->
            <div class="option-board  option-3" data-max="0">
                <span>Would you like to add extras?</span>
                <p>Optional - Choose as many as you like. A single product</p>
                <div class="option-list option-horizontal">
                    <div class="checkbox">
                        <input type="checkbox" data-singleproduct="true" id="check4" data-option="small" name="check" value="5.50">
                        <label for="check4">
                            <div class="checker"></div>
                            Small
                        </label>
                    </div>
                    <div class="checkbox">
                        <input type="checkbox" data-singleproduct="true" id="check5" data-option="medium" name="check" value="15.98">
                        <label for="check5">
                            <div class="checker"></div>
                            Medium
                        </label>
                    </div>
                    <div class="checkbox">
                        <input type="checkbox" data-singleproduct="true" id="check6" data-option="large" name="check" value="25">
                        <label for="check6">
                            <div class="checker"></div>
                            Large
                        </label>
                    </div>
                </div>
            </div>
            <!--<div>end of checkbox single product board</div>-->
            <div style="margin: 10px;"></div>
            <div class="option-board">
                <span>Special instructions</span>
                <!--<p>Optional - Choose as many as you like.</p>-->
                <div class="option-list">
                    <textarea name="instructions" id="instructions" placeholder="Dressing on the side? No pickles? Let us know here." cols="100" rows="4" style="padding: 5px; border-radius: 5px; margin-top: 5px"></textarea>
                </div>
            </div>
                            `;

   return html;
}