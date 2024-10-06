import requests
from typing import Tuple, List


class NetlifyDomainChecker:
    def __init__(self, access_token: str):
        """
        Initialize the checker with your Netlify personal access token
        Args:
            access_token (str): Your Netlify personal access token
        """
        self.base_url = "https://api.netlify.com/api/v1"
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

    def get_site_info(self) -> List[dict]:
        """
        Get all sites and their custom domains owned by the user
        Returns:
            List[dict]: List of site information including domains
        """
        try:
            response = requests.get(f"{self.base_url}/sites", headers=self.headers)
            response.raise_for_status()
            sites = response.json()

            # Filter sites with custom domains
            sites_with_domains = []
            for site in sites:
                # Custom domains are directly available in the site object
                custom_domain = site.get("custom_domain")
                if custom_domain:
                    sites_with_domains.append(
                        {
                            "name": site["name"],
                            "domain": custom_domain,
                            "url": site["url"],
                        }
                    )

            return sites_with_domains

        except requests.exceptions.RequestException as e:
            print(f"Error fetching sites: {str(e)}")
            return []

    def check_subdomain(self, subdomain: str, domain: str) -> Tuple[bool, str]:
        """
        Check if a subdomain is available for your custom domain
        Args:
            subdomain (str): The subdomain to check
            domain (str): Your custom domain
        Returns:
            Tuple[bool, str]: (is_available, message)
        """
        full_domain = f"{subdomain}.{domain}"
        try:
            # First try DNS resolution through a HEAD request
            response = requests.head(
                f"https://{full_domain}", timeout=5, allow_redirects=True
            )
            return False, f"Subdomain '{full_domain}' is already in use."
        except requests.exceptions.RequestException:
            try:
                # Double check with HTTP in case HTTPS is not configured
                response = requests.head(
                    f"http://{full_domain}", timeout=5, allow_redirects=True
                )
                return (
                    False,
                    f"Subdomain '{full_domain}' is already in use (HTTP only).",
                )
            except requests.exceptions.RequestException:
                return True, f"Subdomain '{full_domain}' appears to be available!"
