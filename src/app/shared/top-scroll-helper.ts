export class TopScrollHelper {
  public static scrollToTop = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 0) {
      window.requestAnimationFrame(TopScrollHelper.scrollToTop);
      window.scrollTo(0, scrollTop - scrollTop / 8);
    }
  };
}
