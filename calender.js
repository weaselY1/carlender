window.onload = function () {
  const weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthly = ["January", "February","March","April","May","June","July","August","September","October","November","December"];

  const dobj_ = {
      now: new Date,
      fn: function() { return this.now.getDate() + "-" + (this.now.getMonth() + 1) + "-" + this.now.getFullYear() },
      fw: function(ny, nm) { return (new Date(ny, (parseInt(nm)-1), 1)).getDay(); },
      nd: function(ny, nm){ return new Date(ny, (parseInt(nm)), 0).getDate(); },
      month_maxoffset: 0,
      mouseDown: false,
      old_mouseY: 0,
      movemove: 0,
      month_maxoffset_fn: function(){
        const month_object = document.querySelector(".movable-mon").querySelectorAll(".monthobj");
        // clientHeight ไม่รวม border แต่ offsetHeight รวม border
        // -11 คือ ระยะ border ของ child รวมทุกอัน
        return (document.querySelector(".monthoption").clientHeight*(-7/5) - 11);
      },
      movemove_fn: function(e){
        return document.querySelector(".movable-mon").offsetTop;
      },
      mmove_fn:function(e, offsetY) {
            if (this.mouseDown && !scm_.mouseDown_scrll) {
                  if (this.old_mouseY == 0) {
                      this.old_mouseY = offsetY
                  }else if (this.old_mouseY !== offsetY) {
                      this.movemove = this.movemove - (this.old_mouseY - offsetY);
                      if (this.movemove > 0) {
                        document.querySelector(".scrll_m").style.top = 0  + "%" ;
                        document.querySelector(".movable-mon").style.top = 0 + "%";
                      }else if (this.movemove < this.month_maxoffset) {
                        document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6)/(document.querySelector(".monthoption").clientHeight)*100  + "%" ;
                        document.querySelector(".movable-mon").style.top = this.month_maxoffset/(document.querySelector(".monthoption").clientHeight)*100 + "%";
                      }else {
                        document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6) * (1 - ((this.month_maxoffset - this.movemove)/this.month_maxoffset))/(document.querySelector(".monthoption").clientHeight)*100 + "%" ;
                        document.querySelector(".movable-mon").style.top = this.movemove/(document.querySelector(".monthoption").clientHeight)*100 + "%";
                      }
                  };
                  this.old_mouseY = offsetY;
            }
        },
      offsetY_fn: function(e) {
        rect = document.querySelector(".monthoption").getBoundingClientRect();
        // e.clientY คือ พิกัดตำแหน่งของเม้าบนหน้าจอในแกน y
        // getBoundingClientRect.top คือ พิกัดตำแหน่งของ element relative to viewpoint บนหน้าจอ
        // นำมาลบกันก็จะได้ตำแหน่งของเม้าบน element
        return (e.clientY - rect.top);
      },
      offsetY_fn_touch: function(e) {
        rect = document.querySelector(".monthoption").getBoundingClientRect();
        return (e.touches[0].clientY - rect.top);
      },
      pick_mup:function(e){
          if (e.target.classList.contains("monthobj") && (e.which == 1 || e.touches) && st_obj) {
              document.querySelector(".cal-topbar-mon").innerHTML = e.target.innerText;
              document.querySelector(".monthoption").style.display = "none";

              const __month = monthly.indexOf(e.target.innerText.replace(/\s/g, '')) + 1;
              const __year = document.querySelector(".cal-topbar-yea").innerText;

              const nfd_ = this.fw(__year, __month);
              const nnd_ = this.nd(__year, __month);

              const aweek = document.querySelectorAll(".aweek");
              for (var i = 0; i < aweek.length; i++) {
                document.getElementById('calender').removeChild(aweek[i]);
              }

              let dayx_ = 1; let daya_ = "";
              const nweek_ = Math.ceil((nfd_ + nnd_)/7);
              for (var i = 0; i < nweek_; i++) {
                if (i == 0)  {
                    let frow_ = "";
                    for (var ix = 0; ix < nfd_; ix++) {
                        frow_ = frow_ + "<div class='aday dayb'></div>";
                    }
                    for (var iy = 0; iy < (7 - nfd_); iy++) {
                        frow_ = frow_ + `<div class='aday days unable_sl' id='day${dayx_-1}'><span>${dayx_}</span></div>`;
                        dayx_ = dayx_ + 1;
                    }
                    daya_ = daya_ + `<div class='aweek week${i}'>${frow_}</div>`;
                }else {
                    let frow_ = "";
                    for (var iy = 0; iy < 7; iy++) {
                      if (dayx_ > nnd_) {
                          frow_ = frow_ + "<div class='aday dayb'></div>";
                      }else {
                        frow_ = frow_ + `<div class='aday days unable_sl' id='day${dayx_-1}'><span>${dayx_}</span></div>`;
                      }
                      dayx_ = dayx_ + 1;
                    }
                    daya_ = daya_ + `<div class='aweek week${i}'>${frow_}</div>`;
                }
              }

              const calid = document.getElementById('calender');
              calid.insertAdjacentHTML("beforeend", daya_)

              if (__month == (this.now.getMonth() + 1) && __year == this.now.getFullYear()) {
                  const days = document.querySelectorAll(".days");
                  days[this.now.getDate()-1].classList.add("daysnw");
              }
          }
      }
  };
  const yobj_ = {
      year_maxoffset: 0,
      yr_mouseDown:false,
      yr_old_mouseY:0,
      yr_movemove:0,
      year_maxoffset_fn:function(){
          const year_object = document.querySelector(".movable-yea").querySelectorAll(".yeaobj");
          return document.querySelector(".movable-yea").clientHeight + 3 - year_object[0].offsetHeight * year_object.length;
      },
      nmove_fn:function(offsetY){
        if (yobj_.yr_mouseDown && (!scy_.mouseDown_scrll)) {
            if (yobj_.yr_old_mouseY == 0) {
                yobj_.yr_old_mouseY = offsetY;
            }else if (yobj_.yr_old_mouseY !== offsetY) {
                yobj_.yr_movemove = yobj_.yr_movemove - (yobj_.yr_old_mouseY - offsetY);
                document.querySelector(".scrll_y").style.top = (document.querySelector(".yeaoption").clientHeight * 0.6) * (1 - ((yobj_.year_maxoffset - yobj_.yr_movemove)/yobj_.year_maxoffset))*100/document.querySelector(".yeaoption").clientHeight + "%" ;
                document.querySelector(".movable-yea").style.top = yobj_.yr_movemove*100/document.querySelector(".yeaoption").clientHeight + "%";
                const year_object = document.querySelector(".movable-yea").querySelectorAll(".yeaobj");
                if (yobj_.yr_movemove > (-year_object[0].offsetHeight)) {
                    document.querySelector(".movable-yea").removeChild(year_object[8]);
                    document.querySelector(".movable-yea").insertAdjacentHTML("afterbegin", "<div class='yeaobj unable_sl'>" + (parseInt(year_object[0].innerHTML) - 1 ) + "</div>");
                    yobj_.yr_movemove = yobj_.yr_movemove - year_object[4].offsetHeight;
                    document.querySelector(".movable-yea").style.top = (yobj_.yr_movemove - year_object[4].offsetHeight*2)*100/document.querySelector(".yeaoption").clientHeight + "%";
                }else if (yobj_.yr_movemove < (yobj_.year_maxoffset + year_object[0].offsetHeight)) {
                    document.querySelector(".movable-yea").insertAdjacentHTML("beforeend", "<div class='yeaobj unable_sl'>" + (parseInt(year_object[8].innerHTML) + 1 ) + "</div>");
                    document.querySelector(".movable-yea").removeChild(year_object[0]);
                    yobj_.yr_movemove = yobj_.yr_movemove + year_object[4].offsetHeight;
                    document.querySelector(".movable-yea").style.top = (yobj_.yr_movemove - year_object[4].offsetHeight*2)*100/document.querySelector(".yeaoption").clientHeight + "%";
                }
            }
            yobj_.yr_old_mouseY = offsetY;
        }
      },
      pick_yup:function(e){
            if (e.target.classList.contains("yeaobj") && (e.which == 1 || e.touches) && st_obj) {
                document.querySelector(".cal-topbar-yea").innerHTML = e.target.innerText;
                document.querySelector(".yeaoption").style.display = "none";

                let __month = monthly.indexOf(document.querySelector(".cal-topbar-mon").innerText) + 1;
                let __year = document.querySelector(".cal-topbar-yea").innerText;

                const nfd_ = dobj_.fw(__year, __month);
                const nnd_ = dobj_.nd(__year, __month);

                const aweek = document.querySelectorAll(".aweek");
                for (var i = 0; i < aweek.length; i++) {
                  document.getElementById('calender').removeChild(aweek[i]);
                }

                let dayx_ = 1; let daya_ = "";
                const nweek_ = Math.ceil((nfd_ + nnd_)/7);
                for (var i = 0; i < nweek_; i++) {
                    if (i == 0)  {
                        let frow_ = "";
                        for (var ix = 0; ix < nfd_; ix++) {
                            frow_ = frow_ + "<div class='aday dayb'></div>";
                        }
                        for (var iy = 0; iy < (7 - nfd_); iy++) {
                            frow_ = frow_ + `<div class='aday days unable_sl' id='day${dayx_-1}'><span>${dayx_}</span></div>`;
                            dayx_ = dayx_ + 1;
                        }
                        daya_ = daya_ + `<div class='aweek week${i}'>${frow_}</div>`;
                    }else {
                        let frow_ = "";
                        for (var iy = 0; iy < 7; iy++) {
                          if (dayx_ > nnd_) {
                              frow_ = frow_ + "<div class='aday dayb'></div>";
                          }else {
                            frow_ = frow_ + `<div class='aday days unable_sl' id='day${dayx_-1}'><span>${dayx_}</span></div>`;
                          }
                          dayx_ = dayx_ + 1;
                        }
                        daya_ = daya_ + `<div class='aweek week${i}'>${frow_}</div>`;
                    }
                }

                const calid = document.getElementById('calender');
                calid.insertAdjacentHTML("beforeend", daya_)

                if (__month == (dobj_.now.getMonth() + 1) && __year == dobj_.now.getFullYear()) {
                    const days = document.querySelectorAll(".days");
                    days[dobj_.now.getDate()-1].classList.add("daysnw");
                }
            }
        }
  }
  const scm_ = {
    mouseDown_scrll: false,
    mscrllRD: false,
    old_mouseY_scrll:0,
    movemove_scrll: 0,
    nmove_fn: function(scrOffset) {
          if (this.old_mouseY_scrll == 0) {
            this.old_mouseY_scrll = scrOffset;
          }else if (this.old_mouseY_scrll !== scrOffset) {
              this.movemove_scrll = this.movemove_scrll - (this.old_mouseY_scrll - scrOffset);
              if (this.movemove_scrll < 0) {
                document.querySelector(".movable-mon").style.top = 0 + "%";
                document.querySelector(".scrll_m").style.top = 0 + "%";
              }else if (this.movemove_scrll > document.querySelector(".monthoption").clientHeight * 0.6) {
                document.querySelector(".movable-mon").style.top = dobj_.month_maxoffset*100/document.querySelector(".monthoption").clientHeight + "%";
                document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6)*100/document.querySelector(".monthoption").clientHeight + "%";
              }else {
                document.querySelector(".movable-mon").style.top = (1 - ((document.querySelector(".monthoption").clientHeight * 0.6 - this.movemove_scrll)/(document.querySelector(".monthoption").clientHeight * 0.6))) * dobj_.month_maxoffset*100/document.querySelector(".monthoption").clientHeight + "%";
                document.querySelector(".scrll_m").style.top = this.movemove_scrll*100/document.querySelector(".monthoption").clientHeight + "%";
              }
          }
          this.old_mouseY_scrll = scrOffset;
    }
  }
  const scy_ = {
    mouseDown_scrll: false,
    mscrllRD: false,
    old_mouseY_scrll:0,
    movemove_scrll: 0,
    nmove_fn: function(scrOffset){
      if (this.mouseDown_scrll) {
          if (this.old_mouseY_scrll == 0) {
            this.old_mouseY_scrll = scrOffset;
          }else if (this.old_mouseY_scrll !== scrOffset) {
              this.movemove_scrll = this.movemove_scrll - (this.old_mouseY_scrll - scrOffset);
              if (this.movemove_scrll < document.querySelector(".yeaoption").clientHeight * 0.05) {
                  document.querySelector(".scrll_y").style.top = document.querySelector(".yeaoption").clientHeight * 0.05 + "px" ;
              }else if ((this.movemove_scrll + document.querySelector(".scrll_y").clientHeight) > document.querySelector(".yeaoption").clientHeight * 0.95) {
                  document.querySelector(".scrll_y").style.top = document.querySelector(".yeaoption").clientHeight * 0.95 + document.querySelector(".scrll_y") + "px" ;
              }else {
                  document.querySelector(".scrll_y").style.top = this.movemove_scrll + "px" ;
              }
          }
          this.old_mouseY_scrll = scrOffset
      }
    }
  }
  let st_obj = false;
  let iter_y;
  let pick_targ;

  const mdown = (e) => {
    // e.which = 1 คือ เช็ค event ว่าเป็น 'คลิ้กซ้าย'
    const touchL = e.touches ? (e.touches.length > 0) : "false";
    if ((e.which == 1 || touchL) && !e.target.classList.contains('scrll_m') && !e.target.classList.contains('scrllm_rail')) {
        e.preventDefault();
        clearSelection();
        dobj_.month_maxoffset = dobj_.month_maxoffset_fn();
        // กด click down detect
        dobj_.mouseDown = true;
        dobj_.old_mouseY = 0;
        dobj_.movemove = dobj_.movemove_fn(e);
    }
  };
  const mmove = (e) => {
      let offsetY;
      if (e.which == 1) { offsetY = dobj_.offsetY_fn(e); }
      else if (e.touches) { offsetY = dobj_.offsetY_fn_touch(e); }
      dobj_.mmove_fn(e, offsetY);
  };
  const mupup = (e) => {
      dobj_.pick_mup(e);
  };
  const whler = (e) => {
      window.addEventListener("wheel", disable_action, {passive: false} );
      dobj_.month_maxoffset = dobj_.month_maxoffset_fn();
      dobj_.movemove = e.currentTarget.querySelector(".movable-mon").offsetTop;
      const offh = e.currentTarget.querySelector(".movable-mon").offsetHeight;
      const delta = Math.sign(e.deltaY);
      if (delta > 0) {
        dobj_.movemove = dobj_.movemove - (0.05 * offh);
        if (dobj_.movemove < dobj_.month_maxoffset) {
          document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6)*100/document.querySelector(".monthoption").clientHeight  + "%" ;
          document.querySelector(".movable-mon").style.top = dobj_.month_maxoffset*100/document.querySelector(".monthoption").clientHeight + "%";
        }else {
          document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6) * (1 - ((dobj_.month_maxoffset - dobj_.movemove)/dobj_.month_maxoffset)) + "px";
          document.querySelector(".movable-mon").style.top = dobj_.movemove + "px";
        }
      }else if (delta < 0) {
        dobj_.movemove = dobj_.movemove + (0.05 * offh);
        if (dobj_.movemove > 0) {
          document.querySelector(".scrll_m").style.top = 0 + "px";
          document.querySelector(".movable-mon").style.top = 0 + "px";
        }else {
          document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6) * (1 - ((dobj_.month_maxoffset - dobj_.movemove)/dobj_.month_maxoffset)) + "px";
          document.querySelector(".movable-mon").style.top = dobj_.movemove + "px";
        }
      }
  }
  const dis_mnw = (e) => {
      window.removeEventListener("wheel", disable_action, {passive: false} );
  }

  const mdown_scrll = (e) => {
    if (e.which == 1) {
      clearSelection();
      scm_.mouseDown_scrll = true;
      scm_.old_mouseY_scrll = 0;
      scm_.movemove_scrll = e.currentTarget.offsetTop;
    }
  };
  const mmove_scrll = (e) => {
      const scrOffset = e.clientY;
      if (scm_.mouseDown_scrll) {
          dobj_.month_maxoffset = dobj_.month_maxoffset_fn();
          scm_.nmove_fn(scrOffset);
      }
  };
  const mdown_ra = (e) => {
    scm_.mscrllRD = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientY - rect.top)/(e.target.clientHeight);
    const ratioB = document.querySelector(".scrll_m").offsetTop / (document.querySelector(".scrllm_rail").offsetHeight - document.querySelector(".scrll_m").offsetHeight);
    dobj_.month_maxoffset = dobj_.month_maxoffset_fn();
    const ratioM = document.querySelector(".movable-mon").offsetTop / (dobj_.month_maxoffset);
    if (ratio < 0.2) {
      document.querySelector(".scrll_m").style.top = 0 + "%" ;
      document.querySelector(".movable-mon").style.top = 0 + "%";
    }else if (ratio > 0.8) {
      document.querySelector(".scrll_m").style.top = (document.querySelector(".scrllm_rail").offsetHeight - document.querySelector(".scrll_m").offsetHeight)*100/document.querySelector(".monthoption").clientHeight  + "%";
      document.querySelector(".movable-mon").style.top = dobj_.month_maxoffset*100/document.querySelector(".monthoption").clientHeight + "%";
    }else {
      document.querySelector(".scrll_m").style.top = ((e.clientY - rect.top) + document.querySelector(".scrllm_rail").offsetTop - document.querySelector(".scrll_m").offsetHeight*0.5)*100/document.querySelector(".monthoption").clientHeight + "%";
      document.querySelector(".movable-mon").style.top = ratio * dobj_.month_maxoffset*100/document.querySelector(".monthoption").clientHeight + "%";
    }
  }

// ----------------------------------------------------------------

  const ydown = (e) => {
      const touchL = e.touches ? (e.touches.length > 0) : "false";
      if ((e.which == 1 || touchL) && !e.target.classList.contains('scrll_y') && !e.target.classList.contains('scrlly_rail')) {
        e.preventDefault();
        clearSelection();
        yobj_.year_maxoffset = yobj_.year_maxoffset_fn();
        yobj_.yr_mouseDown = true;
        yobj_.yr_old_mouseY = 0;
        yobj_.yr_movemove = e.currentTarget.querySelector(".movable-yea").offsetTop;
      }
  };
  const ymove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const offY = e.touches ? e.touches[0].clientY : e.clientY;
      const offsetY = offY - rect.top;
      yobj_.nmove_fn(offsetY);
  };
  const yupup = (e) => {
    yobj_.pick_yup(e);
  };
  const yrwhr = (e) => {
    const year_object = document.querySelector(".movable-yea").querySelectorAll(".yeaobj");
    window.addEventListener("wheel", disable_action, {passive: false} );
    yobj_.year_maxoffset = yobj_.year_maxoffset_fn();
    yobj_.yr_movemove = e.currentTarget.querySelector(".movable-yea").offsetTop;
    const offh = e.currentTarget.querySelector(".movable-yea").offsetHeight;
    const delta = Math.sign(e.deltaY);
    if (delta > 0) {
        yobj_.yr_movemove = yobj_.yr_movemove - (0.05 * offh);
        if (yobj_.yr_movemove < (yobj_.year_maxoffset + year_object[0].offsetHeight)) {
            document.querySelector(".movable-yea").insertAdjacentHTML("beforeend", "<div class='yeaobj unable_sl'>" + (parseInt(year_object[8].innerHTML) + 1 ) + "</div>");
            document.querySelector(".movable-yea").removeChild(year_object[0]);
            yobj_.yr_movemove = yobj_.yr_movemove + year_object[4].offsetHeight;
        }
    }else if (delta < 0) {
        yobj_.yr_movemove = yobj_.yr_movemove + (0.05 * offh);
        if (yobj_.yr_movemove > (-year_object[0].offsetHeight)) {
            document.querySelector(".movable-yea").removeChild(year_object[8]);
            document.querySelector(".movable-yea").insertAdjacentHTML("afterbegin", "<div class='yeaobj unable_sl'>" + (parseInt(year_object[0].innerHTML) - 1 ) + "</div>");
            yobj_.yr_movemove = yobj_.yr_movemove - year_object[4].offsetHeight;
        }
    }
    document.querySelector(".scrll_y").style.top = (document.querySelector(".yeaoption").clientHeight * 0.6) * (1 - ((yobj_.year_maxoffset - yobj_.yr_movemove)/yobj_.year_maxoffset)) + "px";
    document.querySelector(".movable-yea").style.top = yobj_.yr_movemove*100/document.querySelector(".yeaoption").clientHeight + "%";
  }
  const dis_yrw = (e) => {
      window.removeEventListener("wheel", disable_action, {passive: false} );
  }

  const ydown_scrll = (e) => {
    if (e.which == 1) {
        clearSelection();
        scy_.mouseDown_scrll = true;
        scy_.old_mouseY_scrll = 0;
        scy_.movemove_scrll = e.currentTarget.offsetTop;

        const tty = () => {
          if (scy_.mouseDown_scrll) {
                yobj_.yr_movemove = document.querySelector(".movable-yea").offsetTop;
                yobj_.year_maxoffset = yobj_.year_maxoffset_fn();
                const offh = document.querySelector(".movable-yea").offsetHeight;
                if (scy_.movemove_scrll < document.querySelector(".yeaoption").clientHeight * 0.08) {
                    yobj_.yr_movemove = yobj_.yr_movemove - (0.05 * offh);
                }else if (scy_.movemove_scrll < document.querySelector(".yeaoption").clientHeight * 0.25) {
                    yobj_.yr_movemove = yobj_.yr_movemove - (0.01 * offh);
                }else if ((scy_.movemove_scrll + document.querySelector(".scrll_y").clientHeight) > document.querySelector(".yeaoption").clientHeight * 0.92) {
                    yobj_.yr_movemove = yobj_.yr_movemove + (0.05 * offh);
                }else if ((scy_.movemove_scrll + document.querySelector(".scrll_y").clientHeight) > document.querySelector(".yeaoption").clientHeight * 0.7) {
                    yobj_.yr_movemove = yobj_.yr_movemove + (0.01 * offh);
                }
                const year_object = document.querySelector(".movable-yea").querySelectorAll(".yeaobj");
                if (yobj_.yr_movemove < (yobj_.year_maxoffset + year_object[0].offsetHeight)) {
                    document.querySelector(".movable-yea").insertAdjacentHTML("beforeend", "<div class='yeaobj unable_sl'>" + (parseInt(year_object[8].innerHTML) + 1 ) + "</div>");
                    document.querySelector(".movable-yea").removeChild(year_object[0]);
                    yobj_.yr_movemove = yobj_.yr_movemove + year_object[4].offsetHeight;
                } else if (yobj_.yr_movemove > (-year_object[0].offsetHeight)) {
                    document.querySelector(".movable-yea").removeChild(year_object[8]);
                    document.querySelector(".movable-yea").insertAdjacentHTML("afterbegin", "<div class='yeaobj unable_sl'>" + (parseInt(year_object[0].innerHTML) - 1 ) + "</div>");
                    yobj_.yr_movemove = yobj_.yr_movemove - year_object[4].offsetHeight;
                }
                document.querySelector(".movable-yea").style.top = yobj_.yr_movemove*100/document.querySelector(".yeaoption").clientHeight + "%";
          }
        };
        clearInterval(iter_y);
        iter_y = setInterval(tty, 50);
    }
  };
  const ymove_scrll = (e) => {
      const scrOffset = e.clientY;
      scy_.nmove_fn(scrOffset);
  };
  const ydown_ra = (e) => {
      if (e.which == 1) {
            scy_.mscrllRD = true;
            const rty = (etar, e) => {
                    const rect = etar.getBoundingClientRect();
                    const ratio = (e.clientY - rect.top)/(etar.clientHeight);
                    const ratioB = document.querySelector(".scrll_y").offsetTop / (document.querySelector(".scrlly_rail").offsetHeight - document.querySelector(".scrll_y").offsetHeight);
                    yobj_.year_maxoffset = yobj_.year_maxoffset_fn();
                    const ratioM = document.querySelector(".movable-yea").offsetTop / (yobj_.year_maxoffset);

                    if (ratio < 0.25) {
                        document.querySelector(".scrll_y").style.top = 5 + "%" ;
                    }else if (ratio > 0.75) {
                        document.querySelector(".scrll_y").style.top = 55 + "%";
                    }else {
                        document.querySelector(".scrll_y").style.top = (e.clientY - rect.top) + document.querySelector(".scrlly_rail").offsetTop - document.querySelector(".scrll_y").offsetHeight*0.5 + "px";
                    }
                    yobj_.yr_movemove = document.querySelector(".movable-yea").offsetTop;
                    const offh = document.querySelector(".movable-yea").offsetHeight;
                    if (ratio < 0.5) {
                        yobj_.yr_movemove = yobj_.yr_movemove - (0.05 * offh);
                    }else if (ratio > 0.5) {
                        yobj_.yr_movemove = yobj_.yr_movemove + (0.05 * offh);
                    }
                    const year_object = document.querySelector(".movable-yea").querySelectorAll(".yeaobj");
                    if (yobj_.yr_movemove < (yobj_.year_maxoffset + year_object[0].offsetHeight)) {
                        document.querySelector(".movable-yea").insertAdjacentHTML("beforeend", "<div class='yeaobj unable_sl'>" + (parseInt(year_object[8].innerHTML) + 1 ) + "</div>");
                        document.querySelector(".movable-yea").removeChild(year_object[0]);
                        yobj_.yr_movemove = yobj_.yr_movemove + year_object[4].offsetHeight;
                    } else if (yobj_.yr_movemove > (-year_object[0].offsetHeight)) {
                        document.querySelector(".movable-yea").removeChild(year_object[8]);
                        document.querySelector(".movable-yea").insertAdjacentHTML("afterbegin", "<div class='yeaobj unable_sl'>" + (parseInt(year_object[0].innerHTML) - 1 ) + "</div>");
                        yobj_.yr_movemove = yobj_.yr_movemove - year_object[4].offsetHeight;
                    }
                    document.querySelector(".movable-yea").style.top = yobj_.yr_movemove*100/document.querySelector(".yeaoption").clientHeight + "%";
            }
            etar = e.currentTarget;
            clearInterval(iter_y);
            rtyy = () => { return rty(etar, e); }
            iter_y = setInterval(rtyy, 50);
      }
  }

  const mn_ = document.getElementById("calender_bas");
  const bd_ = document.getElementsByTagName("body");

  const slidebar_DOM_m ="<span class='scrllm_rail unable_sl'></span><span class='unable_sl scroller scrll_m'></span>"
  const slidebar_DOM_y ="<span class='scrlly_rail unable_sl'></span><span class='unable_sl scroller scrll_y'></span>"

  let ptm_ = "";
  for (var i = 0; i < 12; i++) {
    ptm_ = ptm_ + `<div class='monthobj unable_sl'> ${monthly[i]} </div>`;
  }
  let pty_ = "";
  for (var i = 0; i < 9; i++) {
    pty_ = pty_ + `<div class='yeaobj unable_sl'> ${dobj_.now.getFullYear() - 4 + i} </div>`;
  }
  let ptw_ = "";
  for (var i = 0; i < 7; i++) {
    ptw_ = ptw_ + `<div class='getday unable_sl'><span> ${weekday[i]} </span></div>`;
  }

  const nfd_ = dobj_.fw(dobj_.now.getFullYear(), dobj_.now.getMonth() + 1);
  const nnd_ = dobj_.nd(dobj_.now.getFullYear(), dobj_.now.getMonth() + 1);

  let dayx_ = 1; let daya_ = "";
  const nweek_ = Math.ceil((nfd_ + nnd_)/7);
  for (var i = 0; i < nweek_; i++) {
    if (i == 0)  {
        let frow_ = "";
        for (var ix = 0; ix < nfd_; ix++) {
            frow_ = frow_ + "<div class='aday dayb'></div>";
        }
        for (var iy = 0; iy < (7 - nfd_); iy++) {
            frow_ = frow_ + `<div class='aday days unable_sl' id='day${dayx_-1}'><span>${dayx_}</span></div>`;
            dayx_ = dayx_ + 1;
        }
        daya_ = daya_ + `<div class='aweek week${i}'>${frow_}</div>`;
    }else {
        let frow_ = "";
        for (var iy = 0; iy < 7; iy++) {
          if (dayx_ > nnd_) {
              frow_ = frow_ + "<div class='aday dayb'></div>";
          }else {
            frow_ = frow_ + `<div class='aday days unable_sl' id='day${dayx_-1}'><span>${dayx_}</span></div>`;
          }
          dayx_ = dayx_ + 1;
        }
        daya_ = daya_ + `<div class='aweek week${i}'>${frow_}</div>`;
    }
  }

  const pt_ = `<div class='monthoption'>
                    <div class='movable-mon'>${ptm_}</div> ${slidebar_DOM_m} </div>
                <div class='yeaoption'>
                    <div class='movable-yea'>${pty_}</div> ${slidebar_DOM_y} </div>`

  const p_ =  ` <div class='calender_bg'>
                      <div class="fmbox">
                          <div id='calender'>
                                <div class='cal-topbar'>
                                      <div class='cal-topbar-mon unable_sl'>
                                          ${monthly[dobj_.now.getMonth()]}
                                      </div>
                                      <div class='cal-topbar-yea unable_sl'>
                                          ${dobj_.now.getFullYear()}
                                      </div>
                                      ${pt_}
                                </div>
                                <div class='aweek_fl'>
                                  ${ptw_}
                                </div>
                                ${daya_}
                          </div>
                      </div>
                </div>`
  bd_[0].insertAdjacentHTML("beforeend", p_)

  const days = document.querySelectorAll(".days");
  days[dobj_.now.getDate()-1].classList.add("daysnw");

  document.querySelector(".monthoption").addEventListener('mousedown',  mdown, false);
  document.querySelector(".monthoption").addEventListener('mousemove',  mmove, false);
  document.querySelector(".monthoption").addEventListener('mouseup',  mupup, false);
  document.querySelector(".monthoption").addEventListener('touchstart',  mdown, false);
  document.querySelector(".monthoption").addEventListener('touchmove',  mmove, false);
  document.querySelector(".monthoption").addEventListener('touchend',  mupup, false);
  document.querySelector(".monthoption").addEventListener("wheel", whler, false);
  document.querySelector(".monthoption").addEventListener("mouseout", dis_mnw, false);
  document.querySelector(".scrll_m").addEventListener('mousedown',  mdown_scrll, false);
  document.querySelector(".scrll_m").addEventListener('mousemove',  mmove_scrll, false);
  document.querySelector(".scrllm_rail").addEventListener('mousedown',  mdown_ra, false);

  document.querySelector(".yeaoption").addEventListener('mousedown',  ydown, false);
  document.querySelector(".yeaoption").addEventListener('mousemove',  ymove, false);
  document.querySelector(".yeaoption").addEventListener('mouseup',  yupup, false);
  document.querySelector(".yeaoption").addEventListener('touchstart',  ydown, false);
  document.querySelector(".yeaoption").addEventListener('touchmove',  ymove, false);
  document.querySelector(".yeaoption").addEventListener('touchend',  yupup, false);
  document.querySelector(".yeaoption").addEventListener("wheel", yrwhr, false);
  document.querySelector(".yeaoption").addEventListener("mouseout", dis_yrw, false);
  document.querySelector(".scrll_y").addEventListener('mousedown',  ydown_scrll, false);
  document.querySelector(".scrll_y").addEventListener('mousemove',  ymove_scrll, false);
  document.querySelector(".scrlly_rail").addEventListener('mousedown',  ydown_ra, false);


// ----------------------------------------------------------------
  function clearSelection() {
   if (window.getSelection) {window.getSelection().removeAllRanges();}
   else if (document.selection) {document.selection.empty();}
  }
  function disable_action(e) {
    e.preventDefault();
  }
  function leapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  }
// ----------------------------------------------------------------

  document.addEventListener('click',function(e){
      if(e.target.classList.contains("calender_bas")) {
          pick_targ = e.target;

          //---------------------------------------------------------

          document.querySelector(".cal-topbar-mon").innerHTML = monthly[dobj_.now.getMonth()];
          document.querySelector(".cal-topbar-yea").innerHTML = dobj_.now.getFullYear();

          const nfd_ = dobj_.fw(dobj_.now.getFullYear(), dobj_.now.getMonth() + 1);
          const nnd_ = dobj_.nd(dobj_.now.getFullYear(), dobj_.now.getMonth() + 1);

          const aweek = document.querySelectorAll(".aweek");
          for (var i = 0; i < aweek.length; i++) {
            document.getElementById('calender').removeChild(aweek[i]);
          }

          let dayx_ = 1; let daya_ = "";
          const nweek_ = Math.ceil((nfd_ + nnd_)/7);
          for (var i = 0; i < nweek_; i++) {
              if (i == 0)  {
                  let frow_ = "";
                  for (var ix = 0; ix < nfd_; ix++) {
                      frow_ = frow_ + "<div class='aday dayb'></div>";
                  }
                  for (var iy = 0; iy < (7 - nfd_); iy++) {
                      frow_ = frow_ + `<div class='aday days unable_sl' id='day${dayx_-1}'><span>${dayx_}</span></div>`;
                      dayx_ = dayx_ + 1;
                  }
                  daya_ = daya_ + `<div class='aweek week${i}'>${frow_}</div>`;
              }else {
                  let frow_ = "";
                  for (var iy = 0; iy < 7; iy++) {
                    if (dayx_ > nnd_) {
                        frow_ = frow_ + "<div class='aday dayb'></div>";
                    }else {
                      frow_ = frow_ + `<div class='aday days unable_sl' id='day${dayx_-1}'><span>${dayx_}</span></div>`;
                    }
                    dayx_ = dayx_ + 1;
                  }
                  daya_ = daya_ + `<div class='aweek week${i}'>${frow_}</div>`;
              }
          }

          const calid = document.getElementById('calender');
          calid.insertAdjacentHTML("beforeend", daya_)

          const days = document.querySelectorAll(".days");
          days[dobj_.now.getDate()-1].classList.add("daysnw");

          //---------------------------------------------------------

          document.querySelector(".calender_bg").style.display = "flex";
      }else if (e.target.classList.contains('cal-topbar-mon')) {
          document.querySelector(".monthoption").style.display = "block";
          document.querySelector(".yeaoption").style.display = "none";

          const month_object = document.querySelector(".movable-mon").querySelectorAll(".monthobj");
          const onestep = month_object[0].offsetHeight * -1;
          switch (monthly.indexOf(document.querySelector(".cal-topbar-mon").innerText)) {
            case 3:
              document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6)*(1/7)/(document.querySelector(".monthoption").clientHeight)*100 + "%" ;
              document.querySelector(".movable-mon").style.top = onestep/(document.querySelector(".monthoption").clientHeight)*100 + "%";
              break;
            case 4:
              document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6)*(2/7)/(document.querySelector(".monthoption").clientHeight)*100 + "%" ;
              document.querySelector(".movable-mon").style.top = onestep*2/(document.querySelector(".monthoption").clientHeight)*100 + "%";
              break;
            case 5:
              document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6)*(3/7)/(document.querySelector(".monthoption").clientHeight)*100 + "%" ;
              document.querySelector(".movable-mon").style.top = onestep*3/(document.querySelector(".monthoption").clientHeight)*100 + "%";
              break;
            case 6:
              document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6)*(4/7)/(document.querySelector(".monthoption").clientHeight)*100 + "%" ;
              document.querySelector(".movable-mon").style.top = onestep*4/(document.querySelector(".monthoption").clientHeight)*100 + "%";
              break;
            case 7:
              document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6)*(5/7)/(document.querySelector(".monthoption").clientHeight)*100 + "%" ;
              document.querySelector(".movable-mon").style.top = onestep*5/(document.querySelector(".monthoption").clientHeight)*100 + "%";
              break;
            case 8:
              document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6)*(6/7)/(document.querySelector(".monthoption").clientHeight)*100 + "%" ;
              document.querySelector(".movable-mon").style.top = onestep*6/(document.querySelector(".monthoption").clientHeight)*100 + "%";
              break;
            case 9:
              document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6)/(document.querySelector(".monthoption").clientHeight)*100 + "%" ;
              document.querySelector(".movable-mon").style.top = onestep*7/(document.querySelector(".monthoption").clientHeight)*100 + "%";
              break;
            case 10:
              document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6)/(document.querySelector(".monthoption").clientHeight)*100 + "%" ;
              document.querySelector(".movable-mon").style.top = onestep*7/(document.querySelector(".monthoption").clientHeight)*100 + "%";
              break;
            case 11:
              document.querySelector(".scrll_m").style.top = (document.querySelector(".monthoption").clientHeight * 0.6)/(document.querySelector(".monthoption").clientHeight)*100 + "%" ;
              document.querySelector(".movable-mon").style.top = onestep*7/(document.querySelector(".monthoption").clientHeight)*100 + "%";
              break;
          }
      }else if (e.target.classList.contains('cal-topbar-yea')) {
          const year_object = document.querySelector(".movable-yea").querySelectorAll(".yeaobj");
          for (var i = 0; i < 9; i++) {
            year_object[i].innerHTML = parseInt(document.querySelector(".cal-topbar-yea").innerText) - 4 + i;
          }

          document.querySelector(".monthoption").style.display = "none";
          document.querySelector(".yeaoption").style.display = "block";
          document.querySelector(".movable-yea").style.top = -40 + "%";
      }
  });
  window.addEventListener("resize", function(){
    if (document.querySelector(".movable-mon").offsetTop < dobj_.month_maxoffset_fn()) {
        dobj_.month_maxoffset = dobj_.month_maxoffset_fn();
        document.querySelector(".movable-mon").style.top = dobj_.month_maxoffset*100/(document.querySelector(".monthoption").clientHeight) + '%';
    }
  });

// ----------------------------------------------------------------

  document.addEventListener('mousedown',function(e){
    st_obj  = true;
  });
  document.addEventListener('mousemove',function(e){
    st_obj  = false;

    if (dobj_.mouseDown && e.which == 1) {
        let offsetY;
        if (e.which == 1) { offsetY = dobj_.offsetY_fn(e); }
        else if (e.touches) { offsetY = dobj_.offsetY_fn_touch(e); }
        dobj_.mmove_fn(e, offsetY);
    }else if (scm_.mouseDown_scrll && e.which == 1) {
        const scrOffset = e.clientY;
        dobj_.month_maxoffset = dobj_.month_maxoffset_fn();
        scm_.nmove_fn(scrOffset);
    }
    if (yobj_.yr_mouseDown && e.which == 1) {
        const rect = document.querySelector(".yeaoption").getBoundingClientRect();
        const offY = e.touches ? e.touches[0].clientY : e.clientY;
        const offsetY = offY - rect.top;
        yobj_.nmove_fn(offsetY);
    }else if (scy_.mouseDown_scrll && e.which == 1) {
        const scrOffset = e.clientY;
        scy_.nmove_fn(scrOffset);
    }
  });
  document.addEventListener('mouseup',function(e){
      if (e.target.classList.contains('calender_bg') && (e.which == 1) && st_obj) {
          if (document.querySelector(".monthoption").style.display == "none" && document.querySelector(".yeaoption").style.display == "none") {
            document.querySelector(".calender_bg").style.display = "none";
          }
      }

      if (e.target.classList.contains("days") && st_obj && document.querySelector(".monthoption").style.display == "none" && document.querySelector(".yeaoption").style.display == "none") {
          if (e.which == 1) {
              const __month = monthly.indexOf(document.querySelector(".cal-topbar-mon").innerText) + 1;
              pick_targ.value = `${e.target.innerText} / ${__month} / ${document.querySelector(".cal-topbar-yea").innerText}`;
              document.querySelector(".calender_bg").style.display = "none";
          }
      }else {
          if (!e.target.classList.contains('cal-topbar-mon') && (e.which == 1) && !e.target.classList.contains('monthobj') && !e.target.classList.contains('movable-mon') && !scm_.mscrllRD && !e.target.classList.contains('scrll_m') && st_obj) {
              document.querySelector(".monthoption").style.display = "none";
          }
          if (!e.target.classList.contains('cal-topbar-yea') && (e.which == 1) && !e.target.classList.contains('yeaobj') && !e.target.classList.contains('movable-yea') && !scy_.mscrllRD && !e.target.classList.contains('scrll_y') && st_obj) {
              document.querySelector(".yeaoption").style.display = "none";
          }
      }


      dobj_.mouseDown = false;
      scm_.mouseDown_scrll = false;
      yobj_.yr_mouseDown = false;
      scy_.mouseDown_scrll = false;
      scm_.mscrllRD = false;
      scy_.mscrllRD = false;
      document.querySelector(".scrll_y").style.top = 30 + "%" ;
      clearInterval(iter_y);
  });
  document.addEventListener('touchstart',function(e){
    st_obj  = true;
  });
  document.addEventListener('touchmove',function(e){
    st_obj  = false;
  });
};
